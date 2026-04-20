/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 17:31:21
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 16:55:07
 * @FilePath: \Back-end-template\src\modules\auth\controller\logout.ts
 * @Description: 登出账号
 */
import { REQUEST_PARAMS_ERROR_CODE } from '@/config/errorCode';
import { RefreshTokenReq } from '@/modules/auth/interface';
import { revokeRefreshToken } from '@/modules/auth/service/refreshToken.service';
import { myError } from '@/utils/errors';

module.exports = {
  method: 'post',
  unCheckToken: true,
  controller: async ({ refreshToken }: RefreshTokenReq, req: any) => {
    if (!refreshToken) {
      throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('request_params_error'));
    }

    await revokeRefreshToken(refreshToken, req);
    return { success: true };
  }
};
