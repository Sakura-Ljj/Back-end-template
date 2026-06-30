/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 15:22:28
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-29 18:17:27
 * @FilePath: \Back-end-template\src\modules\auth\controller\accountCreate.ts
 * @Description: 更新或新增账号
 */
import { CreateAccountReq } from '@/modules/auth/interface';
import { createAccount } from '@/modules/auth/service/account.service';
import { generateUniqueAccount } from '@/utils/crypto';

module.exports = {
  method: 'post',
  roles: ['SYSTEM_ADMIN'],
  controller: async (event: CreateAccountReq, req: any, res: any) => {
    const { count = 1 } = event
    const accountData = Array.from(new Array(count)).map(() => ({
      account: generateUniqueAccount(8),
      password: generateUniqueAccount(6),
      corp_id: event.corp_id
    }))

    const accountList = await createAccount(accountData, req)

    return accountList.map(item => ({
      password: accountData.find(({ account }) => account === item.account)?.password,
      ...item
    }))
  }
};
