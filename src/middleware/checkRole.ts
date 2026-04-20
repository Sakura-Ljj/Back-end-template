/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 15:22:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 16:27:16
 * @FilePath: \Back-end-template\src\middleware\checkRole.ts
 * @Description: 检查角色权限中间件
 */
import { FORBIDDEN_ERROR_CODE } from '@/config/errorCode';
import { getRequestAuthorization } from '@/modules/auth/service/rbac.service';
import { myError } from '@/utils/errors';

export default (roles: string[] = []) => {
  return async (req: any, res: any, next: any) => {
    if (!roles.length) {
      next();
      return;
    }

    const authorization = await getRequestAuthorization(req);
    const userRoles = authorization.roles || [];
    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      res.status(403).send(myError(FORBIDDEN_ERROR_CODE, req.__('no_permission_error')));
      return;
    }

    next();
  };
};
