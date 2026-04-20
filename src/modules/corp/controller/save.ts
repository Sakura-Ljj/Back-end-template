import { SaveCorpReq } from '@/modules/corp/interface';
import { saveCorp } from '@/modules/corp/service/corp.service';

module.exports = {
  method: 'post',
  permissions: ['corp.update'],
  controller: async (event: SaveCorpReq, req: any) => {
    return saveCorp(event, req);
  }
};
