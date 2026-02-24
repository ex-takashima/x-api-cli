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

export interface XliConfig {
  auth?: AuthCredentials;
  user?: UserInfo;
}

export interface GlobalOptions {
  json?: boolean;
  noColor?: boolean;
  verbose?: boolean;
}
