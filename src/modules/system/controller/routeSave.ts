/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-28 17:14:29
 * @FilePath: \Back-end-template\src\modules\system\controller\routeSave.ts
 * @Description: 
 */
import { SaveRouteReq } from '@/modules/system/interface';
import { saveRoute } from '@/modules/system/service/route.service';

module.exports = {
  method: 'post',
  // permissions: ['SYSTEM_ADMIN'],
  unCheckToken: true,
  controller: async (event: SaveRouteReq, req: any) => {
    return saveRoute(event, req);
  }
};
