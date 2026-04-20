import { getRecentConfigs } from '@/modules/system/service/config.service';

module.exports = {
  method: 'get',
  permissions: ['system.config.read'],
  controller: async (event: any, req: any) => {
    return getRecentConfigs(req);
  }
};
