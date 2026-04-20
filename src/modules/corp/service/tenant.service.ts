import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export const getRequestCorpId = (req: any): string | null => {
  return req.getTokenInfo?.()?.corp_id || req.tokenInfo?.corp_id || null;
};

export const resolveWritableCorpId = (req: any, explicitCorpId?: string | null): string | null => {
  const requestCorpId = getRequestCorpId(req);

  if (requestCorpId) return requestCorpId;

  return explicitCorpId || null;
};

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
