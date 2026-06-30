/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 15:22:28
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-29 13:56:49
 * @FilePath: \Back-end-template\src\modules\auth\controller\roleSave.ts
 * @Description: 新增角色
 */
import { SaveRoleReq } from '@/modules/auth/interface';
import { saveRole } from '@/modules/auth/service/role.service';

module.exports = {
  method: 'post',
  unCheckToken: true,
  controller: async (event: SaveRoleReq, req: any, res: any) => {
    return saveRole(event, req)
  }
};
