/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-28 14:22:04
 * @FilePath: \Back-end-template\src\modules\corp\service\corp.service.ts
 * @Description: 住户逻辑服务
 */
import { AppDataSource } from '@/config/database';
import { REQUEST_PARAMS_ERROR_CODE } from '@/config/errorCode';
import { Corp } from '@/modules/corp/entity/corp.entity';
import { SaveCorpReq } from '@/modules/corp/interface';
import { myError } from '@/utils/errors';
import { generateUniqueAccount } from '@/utils/crypto';

export const corpRepository = AppDataSource.getRepository(Corp);

export const getCorpList = async () => {
  const list = await corpRepository.find({
    order: {
      create_at: 'DESC'
    }
  });

  return { list };
};

export const saveCorp = async (payload: SaveCorpReq, req: any) => {
  if (!payload.corp_id || !payload.corp_name) {
    throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('request_params_error'));
  }

  let corp = await corpRepository.findOne({
    where: { corp_id: payload.corp_id }
  });

  const tokenInfo = req.requireTokenInfo?.();
  const updater = tokenInfo?.uid || 'system';
  const data = {
    corp_name: payload.corp_name,
    is_enabled: payload.is_enabled !== false,
    remark: payload.remark || '',
    updater
  }
  if (!corp) {
    const pre = 'tempate'
    const corp_id = pre + generateUniqueAccount()
    corp = corpRepository.create({
      ...data,
      corp_id,
      creator: updater,
    });
  } else {
    Object.assign(corp, data)
  }

  return corpRepository.save(corp);
};
