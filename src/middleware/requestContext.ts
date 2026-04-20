/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 15:50:24
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 16:33:50
 * @FilePath: \Back-end-template\src\middleware\requestContext.ts
 * @Description: 请求上下文配置
 */
import crypto from 'crypto';

const getHeaderValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const getClientIp = (req: any) => {
  const forwardedFor = getHeaderValue(req.headers['x-forwarded-for']);
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return (
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip ||
    ''
  );
};

export default (req: any, res: any, next: any) => {
  const requestId = getHeaderValue(req.headers['x-request-id']) || crypto.randomUUID();
  const clientIp = getClientIp(req);

  req.requestId = requestId;
  req.clientIp = clientIp;
  req.getRequestId = () => requestId;
  req.getClientIp = () => clientIp;

  res.setHeader('x-request-id', requestId);
  next();
};
