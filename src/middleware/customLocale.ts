/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 15:21:59
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 16:33:21
 * @FilePath: \Back-end-template\src\middleware\customLocale.ts
 * @Description: 自定义国际化配置
 */
import i18n from 'i18n';

export default (req: any, res: any, next: any) => {
  const locale = req.headers['x-language'];
  if (typeof locale === 'string' && locale) {
    i18n.setLocale(locale);
  }
  next();
};