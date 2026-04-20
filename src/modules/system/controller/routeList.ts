import { getRouteAdminList } from '@/modules/system/service/route.service';

module.exports = {
  method: 'get',
  permissions: ['system.route.read'],
  controller: async (event: any, req: any) => {
    return getRouteAdminList(req);
  }
};
