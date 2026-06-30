/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-29 18:17:45
 * @FilePath: \Back-end-template\src\modules\system\controller\routeList.ts
 * @Description: 
 */
import { getRouteAdminList } from '@/modules/system/service/route.service';

module.exports = {
  method: 'get',
  roles: ['SYSTEM_ADMIN'],
  controller: async (event: any, req: any) => {
    return getRouteAdminList(req);
  }
};
