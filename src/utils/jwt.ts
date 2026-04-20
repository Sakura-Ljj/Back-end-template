import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRES_IN, JWT_SECRET } from '@/config/authConfig';

export const encode = (payload: Omit<TokenPayload, 'iat' | 'exp'>) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN as any });
};

export const verifyToken = (token: string) => {
  const tokenInfo = jwt.verify(token, JWT_SECRET) as TokenPayload;
  if (tokenInfo.tokenType && tokenInfo.tokenType !== 'access') {
    throw new Error('invalid token type');
  }

  return tokenInfo;
};

export const decodeTokenUnsafe = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
