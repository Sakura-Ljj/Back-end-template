/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-17 09:59:13
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 16:21:39
 * @FilePath: \Back-end-template\src\middleware\checkPermission.ts
 * @Description: 检查详细权限中间件
 */
import { FORBIDDEN_ERROR_CODE } from '@/config/errorCode';
import { getRequestAuthorization } from '@/modules/auth/service/rbac.service';
import { myError } from '@/utils/errors';

export default (permissions: string[] = []) => {
  return async (req: any, res: any, next: any) => {
    if (!permissions.length) {
      next();
      return;
    }

    const authorization = await getRequestAuthorization(req);
    const userPermissions = authorization.permissions || [];
    const hasPermissions = permissions.every((permission) => userPermissions.includes(permission));

    if (!hasPermissions) {
      res.status(403).send(myError(FORBIDDEN_ERROR_CODE, req.__('no_permission_error')));
      return;
    }

    next();
  };
};
