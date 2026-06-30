/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-29 11:24:16
 * @FilePath: \Back-end-template\src\modules\auth\service\account.service.ts
 * @Description: 
 */
import { AppDataSource } from '@/config/database';
import { Account } from '@/modules/auth/entity/account.entity';
import { CreateAccountPayload } from '../interface';
import { hashPassword, generateUniqueAccount } from '@/utils/crypto';
import { myError } from '@/utils/errors';
import { REQUEST_PARAMS_ERROR_CODE } from '@/config/errorCode';
import { resolveWritableCorpId } from '@/modules/corp/service/tenant.service';
import { In } from 'typeorm';

export const accountRepository = AppDataSource.getRepository(Account);

export const createAccount = async (accountList: CreateAccountPayload[], req: any) => {
  // 检查传入的账号信息中是否存在重复账号
  const accountNames = accountList.map(item => item.account)
  const uniqueAccountNames = new Set(accountNames)
  if (uniqueAccountNames.size !== accountNames.length) {
    throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('account_repeat'))
  }

  return AppDataSource.transaction(async manager => {
    const accountRepository = manager.getRepository(Account)
    const account = await accountRepository.find({
      where: { account: In(accountNames) }
    })
    if (account.length) {
      throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('account_exists'))
    }

    const corpId = resolveWritableCorpId(req)
    const tokenInfo = req.requireTokenInfo?.()
    const updater = tokenInfo?.uid || 'system'
    const insertData = accountList.map(item => {
      const { hash, salt } = hashPassword(item.password)
      return {
        account: item.account,
        password_hash: hash,
        password_salt: salt,
        username: '用户' + generateUniqueAccount(6),
        is_active: true,
        corp_id: corpId || item.corp_id,
        creator: updater,
        updater
      }
    })

    const accounts = await accountRepository.save(insertData)

    return accounts.map(item => ({
      account: item.account,
      username: item.username,
      is_active: item.username,
      corp_id: item.corp_id,
      create_at: item.create_at,
      update_at: item.update_at
    }))
  })
}
