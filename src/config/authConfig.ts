export const JWT_SECRET = process.env.JWT_SECRET || 'replace-me';
export const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '2h';
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
export const JWT_EXPIRES_IN = ACCESS_TOKEN_EXPIRES_IN;
