/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-27 17:31:19
 * @FilePath: \Back-end-template\src\modules\corp\service\tenant.service.ts
 * @Description: 
 */
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export const getRequestCorpId = (req: any): string | null => {
  return req.getTokenInfo?.()?.corp_id || req.tokenInfo?.corp_id || null;
};

/**
 * @description: 防止租户越权
 * @param {any} req
 * @param {string} explicitCorpId
 * @return {*}
 */
export const resolveWritableCorpId = (req: any, explicitCorpId?: string | null): string | null => {
  // token 信息中存在 corp_id 则判断为租户，无 corp_id 判断为全局管理员
  const requestCorpId = getRequestCorpId(req);

  if (requestCorpId) return requestCorpId;

  return explicitCorpId || null;
};

/**
 * @description: 添加公用租户筛选
 * @return {*}
 */
export const appendTenantVisibilityCondition = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  alias: string,
  corpId: string | null,
  fieldName = 'corp_id'
) => {
  if (!corpId) return queryBuilder;

  queryBuilder.andWhere(`(${alias}.${fieldName} IS NULL OR ${alias}.${fieldName} = :corpId)`, {
    corpId
  });

  return queryBuilder;
};
