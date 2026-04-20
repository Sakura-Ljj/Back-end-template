import { getCorpList } from '@/modules/corp/service/corp.service';

module.exports = {
  method: 'get',
  permissions: ['corp.read'],
  controller: async () => {
    return getCorpList();
  }
};
