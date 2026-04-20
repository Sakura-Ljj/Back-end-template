import { SaveRouteReq } from '@/modules/system/interface';
import { saveRoute } from '@/modules/system/service/route.service';

module.exports = {
  method: 'post',
  permissions: ['system.route.update'],
  controller: async (event: SaveRouteReq, req: any) => {
    return saveRoute(event, req);
  }
};
