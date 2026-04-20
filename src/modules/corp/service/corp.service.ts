import { AppDataSource } from '@/config/database';
import { REQUEST_PARAMS_ERROR_CODE } from '@/config/errorCode';
import { Corp } from '@/modules/corp/entity/corp.entity';
import { SaveCorpReq } from '@/modules/corp/interface';
import { myError } from '@/utils/errors';

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

  const existed = await corpRepository.findOne({
    where: { corp_id: payload.corp_id }
  });
  if (existed && existed.id !== payload.id) {
    throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('corp_id_exists'));
  }

  const tokenInfo = req.requireTokenInfo?.();
  const updater = tokenInfo?.uid || 'system';
  let corp = payload.id
    ? await corpRepository.findOne({ where: { id: payload.id } })
    : null;

  const data = {
    corp_id: payload.corp_id,
    corp_name: payload.corp_name,
    is_enabled: payload.is_enabled !== false,
    remark: payload.remark || '',
  }
  if (!corp) {
    corp = corpRepository.create({
      ...data,
      creator: updater,
      updater
    });
  } else {
    Object.assign(corp, { ...data, updater })
  }

  return corpRepository.save(corp);
};
