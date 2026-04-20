/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 15:22:28
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 16:55:31
 * @FilePath: \Back-end-template\src\modules\auth\controller\profile.ts
 * @Description: 获取权限信息
 */
import { getRequestAuthorization } from '@/modules/auth/service/rbac.service';

module.exports = {
  method: 'get',
  permissions: ['auth.profile.read'],
  controller: async (event: any, req: any) => {
    const tokenInfo = req.getTokenInfo?.() || null;
    const authorization = await getRequestAuthorization(req);

    if (!tokenInfo) return null;

    return {
      ...tokenInfo,
      corp_id: tokenInfo.corp_id || null,
      roles: authorization.roles,
      permissions: authorization.permissions
    };
  }
};
