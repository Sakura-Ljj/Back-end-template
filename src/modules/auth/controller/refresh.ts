/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 17:31:21
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 17:01:36
 * @FilePath: \Back-end-template\src\modules\auth\controller\refresh.ts
 * @Description: 刷新 token
 */
import { REQUEST_PARAMS_ERROR_CODE } from '@/config/errorCode';
import { RefreshTokenReq } from '@/modules/auth/interface';
import { refreshAccessToken } from '@/modules/auth/service/refreshToken.service';
import { myError } from '@/utils/errors';

module.exports = {
  method: 'post',
  unCheckToken: true,
  controller: async ({ refreshToken }: RefreshTokenReq, req: any, res: any) => {
    if (!refreshToken) {
      throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('request_params_error'));
    }

    const tokenPair = await refreshAccessToken(refreshToken, req);
    res.set('new_token', tokenPair.accessToken);
    res.set('refresh-token', tokenPair.refreshToken);

    return tokenPair;
  }
};
