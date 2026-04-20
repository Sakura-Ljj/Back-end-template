export interface LoginReq {
  account: string;
  password: string;
}

export interface RefreshTokenReq {
  refreshToken: string;
}
