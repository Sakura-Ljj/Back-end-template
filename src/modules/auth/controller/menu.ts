/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-17 13:27:58
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 16:55:22
 * @FilePath: \Back-end-template\src\modules\auth\controller\menu.ts
 * @Description: 获取前端菜单列表
 */
import { getRequestAuthorization } from '@/modules/auth/service/rbac.service';
import { getRouteMenuTree } from '@/modules/system/service/route.service';

module.exports = {
  method: 'get',
  permissions: ['auth.menu.read'],
  controller: async (event: any, req: any) => {
    const authorization = await getRequestAuthorization(req);
    return getRouteMenuTree(authorization);
  }
};
