/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-27 17:21:36
 * @FilePath: \Back-end-template\src\modules\system\controller\config.ts
 * @Description: 获取系统配置
 */
import { getRecentConfigs } from '@/modules/system/service/config.service';

module.exports = {
  method: 'get',
  permissions: ['system.config.read'],
  controller: async (event: any, req: any) => {
    return getRecentConfigs(req);
  }
};
