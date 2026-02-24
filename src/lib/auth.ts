import http from "node:http";
import {
  OAuth2,
  generateCodeVerifier,
  generateCodeChallenge,
} from "@xdevplatform/xdk";
import open from "open";
import { getAuth, setAuth, setUser, clearAuth } from "./config.js";
import type { AuthCredentials } from "../types/config.js";

const CALLBACK_PORT = 8739;
const REDIRECT_URI = `http://127.0.0.1:${CALLBACK_PORT}/callback`;

const SCOPES = [
  "tweet.read",
  "tweet.write",
  "users.read",
  "offline.access",
  "like.read",
  "list.read",
  "bookmark.read",
];

export function createOAuth2(clientId: string): OAuth2 {
  return new OAuth2({
    clientId,
    redirectUri: REDIRECT_URI,
    scope: SCOPES,
  });
}

export async function startLoginFlow(clientId: string): Promise<AuthCredentials> {
  const oauth2 = createOAuth2(clientId);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  oauth2.setPkceParameters(codeVerifier, codeChallenge);

  const state = Math.random().toString(36).slice(2);
  const authUrl = await oauth2.getAuthorizationUrl(state);

  return new Promise<AuthCredentials>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url!, `http://127.0.0.1:${CALLBACK_PORT}`);

        if (url.pathname !== "/callback") {
          res.writeHead(404);
          res.end("Not found");
          return;
        }

        const code = url.searchParams.get("code");
        const returnedState = url.searchParams.get("state");
        const error = url.searchParams.get("error");

        if (error) {
          res.writeHead(400);
          res.end(`Authorization error: ${error}`);
          server.close();
          reject(new Error(`Authorization denied: ${error}`));
          return;
        }

        if (!code || returnedState !== state) {
          res.writeHead(400);
          res.end("Invalid callback parameters");
          server.close();
          reject(new Error("Invalid callback: missing code or state mismatch"));
          return;
        }

        const tokens = await oauth2.exchangeCode(code, codeVerifier);

        const credentials: AuthCredentials = {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token!,
          expiresAt: Date.now() + tokens.expires_in * 1000,
          clientId,
          scope: SCOPES,
        };

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<html><body><h2>Authentication successful!</h2><p>You can close this window and return to the terminal.</p></body></html>",
        );
        server.close();
        resolve(credentials);
      } catch (err) {
        res.writeHead(500);
        res.end("Internal error");
        server.close();
        reject(err);
      }
    });

    server.listen(CALLBACK_PORT, "127.0.0.1", () => {
      open(authUrl);
    });

    server.on("error", (err) => {
      reject(new Error(`Failed to start callback server: ${err.message}`));
    });

    setTimeout(() => {
      server.close();
      reject(new Error("Login timed out after 5 minutes"));
    }, 5 * 60 * 1000);
  });
}

export async function refreshAccessToken(): Promise<AuthCredentials> {
  const auth = getAuth();
  if (!auth?.refreshToken) {
    throw new Error("No refresh token available. Run `xli auth login`.");
  }

  const oauth2 = createOAuth2(auth.clientId);
  const tokens = await oauth2.refreshToken(auth.refreshToken);

  const updated: AuthCredentials = {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? auth.refreshToken,
    expiresAt: Date.now() + tokens.expires_in * 1000,
    clientId: auth.clientId,
    scope: auth.scope,
  };

  setAuth(updated);
  return updated;
}

export async function ensureValidToken(): Promise<string> {
  const auth = getAuth();
  if (!auth) {
    throw new Error("Not authenticated. Run `xli auth login` first.");
  }

  // Refresh if expiring within 5 minutes
  if (Date.now() > auth.expiresAt - 5 * 60 * 1000) {
    const refreshed = await refreshAccessToken();
    return refreshed.accessToken;
  }

  return auth.accessToken;
}
