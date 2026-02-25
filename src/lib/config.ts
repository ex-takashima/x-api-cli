import Conf from "conf";
import type {
  AuthCredentials,
  UserInfo,
  AccountData,
  XliConfig,
} from "../types/config.js";

const config = new Conf<XliConfig>({
  projectName: "xli",
  schema: {
    auth: { type: "object" as const },
    user: { type: "object" as const },
    currentAccount: { type: "string" as const },
    accounts: { type: "object" as const },
  },
});

// --- Migration from v1 (single account) to v2 (multi-account) ---

function migrateIfNeeded(): void {
  const legacyAuth = config.get("auth") as AuthCredentials | undefined;
  const legacyUser = config.get("user") as UserInfo | undefined;
  const accounts = config.get("accounts") as
    | Record<string, AccountData>
    | undefined;

  // Already migrated or fresh install
  if (!legacyAuth || accounts) return;

  // Migrate: need at least user info to create a key
  if (legacyUser?.username) {
    const key = `@${legacyUser.username}`;
    config.set("accounts", {
      [key]: { auth: legacyAuth, user: legacyUser },
    });
    config.set("currentAccount", key);
  }

  // Clean up legacy keys
  config.delete("auth");
  config.delete("user");
}

// Run migration on module load
migrateIfNeeded();

// --- Active account resolution ---

let overrideAccount: string | undefined;

export function setAccountOverride(account: string | undefined): void {
  overrideAccount = account;
}

function resolveAccountKey(): string | undefined {
  if (overrideAccount) {
    return overrideAccount.startsWith("@")
      ? overrideAccount
      : `@${overrideAccount}`;
  }
  return config.get("currentAccount") as string | undefined;
}

// --- Account CRUD ---

function getAccounts(): Record<string, AccountData> {
  return (config.get("accounts") as Record<string, AccountData>) ?? {};
}

function setAccounts(accounts: Record<string, AccountData>): void {
  config.set("accounts", accounts);
}

export function getAccount(key?: string): AccountData | undefined {
  const k = key ?? resolveAccountKey();
  if (!k) return undefined;
  return getAccounts()[k];
}

export function setAccount(user: UserInfo, auth: AuthCredentials): string {
  const key = `@${user.username}`;
  const accounts = getAccounts();
  accounts[key] = { auth, user };
  setAccounts(accounts);
  return key;
}

export function removeAccount(key: string): boolean {
  const normalizedKey = key.startsWith("@") ? key : `@${key}`;
  const accounts = getAccounts();
  if (!accounts[normalizedKey]) return false;
  delete accounts[normalizedKey];
  setAccounts(accounts);

  // If removed account was current, clear or pick another
  const current = config.get("currentAccount") as string | undefined;
  if (current === normalizedKey) {
    const remaining = Object.keys(accounts);
    if (remaining.length > 0) {
      config.set("currentAccount", remaining[0]);
    } else {
      config.delete("currentAccount");
    }
  }
  return true;
}

export function listAccounts(): { key: string; data: AccountData; current: boolean }[] {
  const accounts = getAccounts();
  const current = config.get("currentAccount") as string | undefined;
  return Object.entries(accounts).map(([key, data]) => ({
    key,
    data,
    current: key === current,
  }));
}

export function switchAccount(key: string): boolean {
  const normalizedKey = key.startsWith("@") ? key : `@${key}`;
  const accounts = getAccounts();
  if (!accounts[normalizedKey]) return false;
  config.set("currentAccount", normalizedKey);
  return true;
}

export function getCurrentAccountKey(): string | undefined {
  return config.get("currentAccount") as string | undefined;
}

// --- Backward-compatible API (delegates to active account) ---

export function getAuth(): AuthCredentials | undefined {
  return getAccount()?.auth;
}

export function setAuth(auth: AuthCredentials): void {
  const account = getAccount();
  if (account) {
    const key = resolveAccountKey()!;
    const accounts = getAccounts();
    accounts[key] = { ...account, auth };
    setAccounts(accounts);
  }
}

export function clearAuth(): void {
  const key = resolveAccountKey();
  if (key) {
    removeAccount(key);
  }
}

export function getUser(): UserInfo | undefined {
  return getAccount()?.user;
}

export function setUser(user: UserInfo): void {
  const account = getAccount();
  if (account) {
    const key = resolveAccountKey()!;
    const accounts = getAccounts();
    accounts[key] = { ...account, user };
    setAccounts(accounts);
  }
}

export function getConfigPath(): string {
  return config.path;
}

export function isAuthenticated(): boolean {
  const auth = getAuth();
  return auth !== undefined && auth.accessToken !== undefined;
}
