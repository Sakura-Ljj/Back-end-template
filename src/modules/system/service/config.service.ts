import { IsNull } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { appendTenantVisibilityCondition, getRequestCorpId, resolveWritableCorpId } from '@/modules/corp/service/tenant.service';
import { AppConfig } from '@/modules/system/entity/appConfig.entity';

export const appConfigRepository = AppDataSource.getRepository(AppConfig);

export const getRecentConfigs = async (req: any) => {
  const corpId = getRequestCorpId(req);
  const queryBuilder = appConfigRepository
    .createQueryBuilder('appConfig')
    .orderBy('appConfig.create_at', 'DESC')
    .take(20);

  appendTenantVisibilityCondition(queryBuilder, 'appConfig', corpId);
  const list = await queryBuilder.getMany();

  return { list };
};

export const upsertConfig = async (
  configKey: string,
  configValue: string,
  remark = '',
  updater = 'system',
  req?: any,
  explicitCorpId?: string | null
) => {
  const corpId = resolveWritableCorpId(req, explicitCorpId);
  let config = await appConfigRepository.findOne({
    where: {
      config_key: configKey,
      corp_id: corpId || IsNull()
    }
  });

  if (!config) {
    config = appConfigRepository.create({
      config_key: configKey,
      corp_id: corpId,
      config_value: configValue,
      remark,
      creator: updater,
      updater
    });
  } else {
    config.config_value = configValue;
    config.remark = remark;
    config.updater = updater;
  }

  return appConfigRepository.save(config);
};
