/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 15:22:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 16:34:12
 * @FilePath: \Back-end-template\src\middleware\setRouter.ts
 * @Description: 挂载路由方法
 */
import log from '@/utils/log';
import { myError } from '@/utils/errors';
import { NO_AUTH_ERROR_CODE, SYSTEM_ERROR_CODE } from '@/config/errorCode';

export default (
  method: AppRouter.RouterMethod,
  handlerFunc: (event: any, req: any, res: any) => Promise<any> | any,
  renderType: 'json' | 'sse' = 'json'
) => {
  return async (req: any, res: any) => {
    const requestId = req.getRequestId?.() || req.requestId || '';
    const clientIp = req.getClientIp?.() || req.clientIp || '';
    const logger = log.child({ requestId, clientIp, path: req.path, method: req.method });

    if (!clientIp) {
      throw myError(NO_AUTH_ERROR_CODE, req.__('no_permission_error'));
    }

    // SSE 类型特殊处理
    if (renderType === 'sse') {
      res.set('Content-Type', 'text/event-stream');
      res.set('Cache-Control', 'no-cache');
      res.set('Connection', 'keep-alive');
    }

    const event = method === 'get' ? req.query : req.body;
    const startTime = Date.now();

    try {
      logger.info('http.request.start', { params: event });
      const data = await handlerFunc(event, req, res);
      logger.info('http.request.end', { costMs: Date.now() - startTime });
      // 接口返回值统一封装
      if (renderType === 'json') {
        res.send({
          code: 200,
          msg: 'success',
          data: data ?? null
        });
      }
    } catch (error: any) {
      logger.error('http.request.error', error, {
        costMs: Date.now() - startTime,
        message: error?.msg || error?.message || 'service error'
      });
      res.status(error?.code || 500).send({
        code: error?.code || SYSTEM_ERROR_CODE,
        msg: error?.msg || 'service error',
        data: null
      });
    }
  };
};
