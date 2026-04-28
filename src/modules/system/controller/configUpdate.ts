/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-27 17:26:31
 * @FilePath: \Back-end-template\src\modules\system\controller\configUpdate.ts
 * @Description: 更新或新增系统配置
 */
import { REQUEST_PARAMS_ERROR_CODE } from '@/config/errorCode';
import { UpdateConfigReq } from '@/modules/system/interface';
import { upsertConfig } from '@/modules/system/service/config.service';
import { myError } from '@/utils/errors';

module.exports = {
  method: 'post',
  permissions: ['system.config.update'],
  controller: async ({ config_key, config_value, remark, corp_id }: UpdateConfigReq, req: any) => {
    if (!config_key || typeof config_value !== 'string') {
      throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('request_params_error'));
    }

    const tokenInfo = req.requireTokenInfo?.();
    const updater = tokenInfo?.uid || 'system';
    const config = await upsertConfig(
      config_key,
      config_value,
      remark || '',
      updater,
      req,
      corp_id || null
    );

    return {
      id: config.id,
      corp_id: config.corp_id,
      config_key: config.config_key,
      config_value: config.config_value,
      remark: config.remark
    };
  }
};
