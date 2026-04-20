/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-16 17:31:21
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-20 09:14:33
 * @FilePath: \Back-end-template\src\modules\auth\service\refreshToken.service.ts
 * @Description: 刷新 Token 服务
 */
import crypto from 'crypto';
import { AppDataSource } from '@/config/database';
import { NO_AUTH_ERROR_CODE, REQUEST_PARAMS_ERROR_CODE } from '@/config/errorCode';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '@/config/authConfig';
import { Account } from '@/modules/auth/entity/account.entity';
import { RefreshToken } from '@/modules/auth/entity/refreshToken.entity';
import { resolveAccountAuthorization } from '@/modules/auth/service/rbac.service';
import { myError } from '@/utils/errors';
import { encode } from '@/utils/jwt';

const REFRESH_TOKEN_ID_LENGTH = 32;

export const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

const hashToken = (value: string) => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

const parseDurationToMs = (duration: string) => {
  const normalized = duration.trim();
  const matched = normalized.match(/^(\d+)(ms|s|m|h|d)$/i);
  if (!matched) {
    throw new Error(`Unsupported duration format: ${duration}`);
  }

  const amount = Number(matched[1]);
  const unit = matched[2].toLowerCase();
  const unitMap: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * unitMap[unit];
};

/**
 * @description: 创建 Access token
 * @param {Account} account
 * @param {AccountAuthorizationContext} authorization
 * @return {*}
 */
const createAccessToken = (account: Account, authorization: AccountAuthorizationContext) => {
  return encode({
    uid: account.uid,
    username: account.username,
    corp_id: account.corp_id,
    roles: authorization.roles,
    permissions: authorization.permissions,
    tokenType: 'access'
  });
};

/**
 * @description: 生成用于刷新 token 的签名
 * @return {*}
 */
const createRefreshTokenRaw = () => {
  const tokenId = crypto.randomBytes(REFRESH_TOKEN_ID_LENGTH).toString('hex').slice(0, REFRESH_TOKEN_ID_LENGTH);
  const secret = crypto.randomBytes(48).toString('base64url');
  return `${tokenId}.${secret}`;
};

/**
 * @description: 拆解刷新 token 的签名
 * @param {string} refreshToken
 * @return {*}
 */
const parseRefreshToken = (refreshToken: string) => {
  const [tokenId, secret] = refreshToken.split('.');
  if (!tokenId || !secret) {
    throw myError(REQUEST_PARAMS_ERROR_CODE, 'request params error');
  }

  return { tokenId, secret };
};

/**
 * @description: 获取刷新 token 的有效期
 * @return {*}
 */
const getRefreshTokenExpiresAt = () => {
  return new Date(Date.now() + parseDurationToMs(REFRESH_TOKEN_EXPIRES_IN));
};

/**
 * @description: 获取头部信息
 * @param {any} req
 * @return {*}
 */
const getSessionContext = (req: any) => ({
  clientIp: req.getClientIp?.() || req.clientIp || '',
  userAgent: typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : ''
});

const assertAccountAvailable = (account: Account | null, req: any): Account => {
  if (!account) {
    throw myError(NO_AUTH_ERROR_CODE, req.__('login_failed'));
  }

  if (!account.is_active) {
    throw myError(NO_AUTH_ERROR_CODE, req.__('user_disabled'));
  }

  return account;
};

/**
 * @description: 构建 Token 返回内容
 * @param {Account} account
 * @param {string} refreshToken
 * @param {AccountAuthorizationContext} authorization
 * @return {*}
 */
const buildTokenPair = (
  account: Account,
  refreshToken: string,
  authorization: AccountAuthorizationContext
) => ({
  accessToken: createAccessToken(account, authorization),
  accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
  refreshToken,
  refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
  corp_id: account.corp_id,
  roles: authorization.roles,
  permissions: authorization.permissions
});

/**
 * @description: 构建刷新 token 的返回值
 * @param {Account} account
 * @param {string} refreshToken
 * @param {any} req
 * @return {*}
 */
const createRefreshTokenRecord = (account: Account, refreshToken: string, req: any) => {
  const { tokenId } = parseRefreshToken(refreshToken);
  const context = getSessionContext(req);

  return {
    token_id: tokenId,
    account_uid: account.uid,
    token_hash: hashToken(refreshToken),
    expires_at: getRefreshTokenExpiresAt(),
    revoked_at: null,
    last_used_at: null,
    replaced_by_token_id: null,
    client_ip: context.clientIp || null,
    user_agent: context.userAgent || null,
    creator: account.uid,
    updater: account.uid
  };
};

/**
 * @description: 生成 Token 及 RefreshToken
 * @param {Account} account
 * @param {any} req
 * @return {*}
 */
export const issueTokenPair = async (account: Account, req: any) => {
  const refreshToken = createRefreshTokenRaw();
  await refreshTokenRepository.insert(createRefreshTokenRecord(account, refreshToken, req));
  const authorization = await resolveAccountAuthorization(account.uid);
  return buildTokenPair(account, refreshToken, authorization);
};

const findRefreshTokenRecord = async (refreshToken: string) => {
  const { tokenId } = parseRefreshToken(refreshToken);
  const tokenRecord = await refreshTokenRepository.findOne({
    where: { token_id: tokenId }
  });

  if (!tokenRecord || tokenRecord.token_hash !== hashToken(refreshToken)) {
    return null;
  }

  return tokenRecord;
};

/**
 * @description: 检测刷新 token 的有效期是否过期
 * @param {RefreshToken} tokenRecord
 * @param {any} req
 * @return {*}
 */
const ensureRefreshTokenUsable = (tokenRecord: RefreshToken, req: any) => {
  if (tokenRecord.revoked_at || tokenRecord.expires_at.getTime() <= Date.now()) {
    throw myError(NO_AUTH_ERROR_CODE, req.__('refresh_token_invalid'));
  }
};

/**
 * @description: 刷新 token
 * @param {string} refreshToken
 * @param {any} req
 * @return {*}
 */
export const refreshAccessToken = async (refreshToken: string, req: any) => {
  const existingToken = await findRefreshTokenRecord(refreshToken);
  if (!existingToken) {
    throw myError(NO_AUTH_ERROR_CODE, req.__('refresh_token_invalid'));
  }

  ensureRefreshTokenUsable(existingToken, req);

  return AppDataSource.transaction(async (manager) => {
    const account = assertAccountAvailable(await manager.getRepository(Account).findOne({
      where: { uid: existingToken.account_uid }
    }), req);

    const nextRefreshToken = createRefreshTokenRaw();
    const { tokenId: nextTokenId } = parseRefreshToken(nextRefreshToken);

    existingToken.revoked_at = new Date();
    existingToken.last_used_at = new Date();
    existingToken.replaced_by_token_id = nextTokenId;
    existingToken.updater = account.uid;
    await manager.getRepository(RefreshToken).save(existingToken);

    await manager.getRepository(RefreshToken).insert(createRefreshTokenRecord(account, nextRefreshToken, req));

    const authorization = await resolveAccountAuthorization(account.uid, manager);
    return buildTokenPair(account, nextRefreshToken, authorization);
  });
};

export const revokeRefreshToken = async (refreshToken: string, req: any) => {
  const tokenRecord = await findRefreshTokenRecord(refreshToken);
  if (!tokenRecord) {
    throw myError(NO_AUTH_ERROR_CODE, req.__('refresh_token_invalid'));
  }

  if (tokenRecord.revoked_at) {
    return;
  }

  tokenRecord.revoked_at = new Date();
  tokenRecord.last_used_at = new Date();
  tokenRecord.updater = tokenRecord.account_uid;
  await refreshTokenRepository.save(tokenRecord);
};
