/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 15:21:59
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 16:30:32
 * @FilePath: \Back-end-template\src\middleware\checkToken.ts
 * @Description: 检查登录态中间件
 */
import { NO_AUTH_ERROR_CODE } from '@/config/errorCode';
import { myError } from '@/utils/errors';
import { verifyToken } from '@/utils/jwt';

/**
 * @description: 获取 Token
 * @param {any} req
 * @return {*}
 */
const extractToken = (req: any) => {
  const authorization = req.headers.authorization;
  if (typeof req.headers.token === 'string' && req.headers.token) {
    return req.headers.token;
  }

  if (typeof authorization === 'string') {
    return authorization.replace(/^Bearer\s+/i, '').trim();
  }

  return '';
};

export default (unCheckToken = false) => {
  return async (req: any, res: any, next: any) => {
    // 无需登录态
    if (unCheckToken) {
      req.tokenInfo = null;
      req.getTokenInfo = () => null;
      next();
      return;
    }

    const token = extractToken(req);
    if (!token || typeof token !== 'string') {
      res.status(401).send(myError(NO_AUTH_ERROR_CODE, req.__('missing_token')));
      return;
    }

    try {
      const tokenInfo = verifyToken(token);
      req.token = token;
      req.tokenInfo = tokenInfo;
      req.getTokenInfo = () => tokenInfo;
      req.requireTokenInfo = () => tokenInfo;
      next();
    } catch {
      res.status(401).send(myError(NO_AUTH_ERROR_CODE, req.__('token_invalid')));
    }
  };
};
