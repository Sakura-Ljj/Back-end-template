/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-27 15:10:07
 * @FilePath: \Back-end-template\src\modules\corp\controller\save.ts
 * @Description: 插入或更新租户
 */
import { SaveCorpReq } from '@/modules/corp/interface';
import { saveCorp } from '@/modules/corp/service/corp.service';

module.exports = {
  method: 'post',
  permissions: ['corp.update'],
  controller: async (event: SaveCorpReq, req: any) => {
    return saveCorp(event, req);
  }
};
