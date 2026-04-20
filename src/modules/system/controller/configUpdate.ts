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
    const config = await upsertConfig(config_key, config_value, remark || '', updater, req, corp_id || null);

    return {
      id: config.id,
      corp_id: config.corp_id,
      config_key: config.config_key,
      config_value: config.config_value,
      remark: config.remark
    };
  }
};
