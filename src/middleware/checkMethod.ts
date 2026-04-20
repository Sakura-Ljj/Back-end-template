/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 15:21:59
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 16:19:14
 * @FilePath: \Back-end-template\src\middleware\checkMethod.ts
 * @Description: 检查请求方法中间件
 */
import { REQUEST_METHOD_ERROR_CODE } from '@/config/errorCode';

function createMethodCheck(expectedMethod: 'GET' | 'POST') {
  return (req: any, res: any, next: any) => {
    if (req.method === expectedMethod) {
      next();
      return;
    }

    res.status(405).json({
      code: REQUEST_METHOD_ERROR_CODE,
      msg: `only ${expectedMethod}`,
      data: null
    });
  };
}

export const checkMethod = (method: AppRouter.RouterMethod) => {
  const methodMap = {
    get: createMethodCheck('GET'),
    post: createMethodCheck('POST')
  };

  return methodMap[method];
};