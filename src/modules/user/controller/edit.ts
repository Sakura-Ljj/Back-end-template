/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 15:22:28
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-29 18:14:36
 * @FilePath: \Back-end-template\src\modules\user\controller\edit.ts
 * @Description: 新增角色
 */
import { AccountBindRoleReq } from '@/modules/auth/interface';
import { accountBindRole } from '@/modules/auth/service/role.service';

module.exports = {
  method: 'post',
  unCheckToken: true,
  controller: async (event: AccountBindRoleReq, req: any, res: any) => {
    return accountBindRole(event)
  }
};
