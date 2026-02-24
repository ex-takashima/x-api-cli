import { Client } from "@xdevplatform/xdk";
import { ensureValidToken } from "./auth.js";
import { AuthRequiredError } from "./errors.js";
import { isAuthenticated } from "./config.js";

export async function getClient(): Promise<Client> {
  if (!isAuthenticated()) {
    throw new AuthRequiredError();
  }

  const accessToken = await ensureValidToken();
  return new Client({ accessToken });
}
