export interface AuthCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp ms
  clientId: string;
  scope: string[];
}

export interface UserInfo {
  id: string;
  username: string;
  name: string;
}

export interface AccountData {
  auth: AuthCredentials;
  user: UserInfo;
}

export interface XliConfig {
  // Legacy (v1) - single account
  auth?: AuthCredentials;
  user?: UserInfo;
  // Multi-account (v2)
  currentAccount?: string; // "@username"
  accounts?: Record<string, AccountData>; // key: "@username"
}

export interface GlobalOptions {
  json?: boolean;
  noColor?: boolean;
  verbose?: boolean;
  account?: string; // --account flag
}
