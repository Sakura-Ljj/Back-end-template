import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRES_IN, JWT_SECRET } from '@/config/authConfig';

/**
 * @description: 签发 token
 * @param {Omit} payload
 * @param {*} iat
 * @return {*}
 */
export const encode = (payload: Omit<TokenPayload, 'iat' | 'exp'>) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN as any });
};

/**
 * @description: 验证 token
 * @param {string} token
 * @return {*}
 */
export const verifyToken = (token: string) => {
  const tokenInfo = jwt.verify(token, JWT_SECRET) as TokenPayload;
  if (tokenInfo.tokenType && tokenInfo.tokenType !== 'access') {
    throw new Error('invalid token type');
  }

  return tokenInfo;
};

/**
 * @description: 解析 token
 * @param {string} token
 * @return {*}
 */
export const decodeTokenUnsafe = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
