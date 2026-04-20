/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 15:22:28
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 14:37:29
 * @FilePath: \Back-end-template\src\modules\auth\controller\login.ts
 * @Description: 登录接口
 */
import { REQUEST_PARAMS_ERROR_CODE, NO_AUTH_ERROR_CODE } from '@/config/errorCode';
import { myError } from '@/utils/errors';
import { LoginReq } from '@/modules/auth/interface';
import { accountRepository } from '@/modules/auth/service/account.service';
import { comparePassword } from '@/utils/crypto';
import { issueTokenPair } from '@/modules/auth/service/refreshToken.service';

module.exports = {
  method: 'post',
  unCheckToken: true,
  controller: async ({ account, password }: LoginReq, req: any, res: any) => {
    if (!account || !password) {
      throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('request_params_error'));
    }

    const accountInfo = await accountRepository.findOne({
      where: { account }
    });

    if (!accountInfo || !comparePassword(password, accountInfo.password_hash, accountInfo.password_salt)) {
      throw myError(NO_AUTH_ERROR_CODE, req.__('login_failed'));
    }

    if (!accountInfo.is_active) {
      throw myError(NO_AUTH_ERROR_CODE, req.__('user_disabled'));
    }

    const tokenPair = await issueTokenPair(accountInfo, req);
    res.set('token', tokenPair.accessToken);
    res.set('refresh-token', tokenPair.refreshToken);

    return
  }
};
