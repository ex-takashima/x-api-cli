import Conf from "conf";
import type { AuthCredentials, UserInfo, XliConfig } from "../types/config.js";

const config = new Conf<XliConfig>({
  projectName: "xli",
  schema: {
    auth: { type: "object" as const },
    user: { type: "object" as const },
  },
});

export function getAuth(): AuthCredentials | undefined {
  return config.get("auth") as AuthCredentials | undefined;
}

export function setAuth(auth: AuthCredentials): void {
  config.set("auth", auth);
}

export function clearAuth(): void {
  config.delete("auth");
  config.delete("user");
}

export function getUser(): UserInfo | undefined {
  return config.get("user") as UserInfo | undefined;
}

export function setUser(user: UserInfo): void {
  config.set("user", user);
}

export function getConfigPath(): string {
  return config.path;
}

export function isAuthenticated(): boolean {
  const auth = getAuth();
  return auth !== undefined && auth.accessToken !== undefined;
}
