/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-27 15:09:43
 * @FilePath: \Back-end-template\src\modules\corp\controller\list.ts
 * @Description: 获取租户列表
 */
import { getCorpList } from '@/modules/corp/service/corp.service';

module.exports = {
  method: 'get',
  permissions: ['corp.read'],
  controller: async () => {
    return getCorpList();
  }
};
