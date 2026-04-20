/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-17 09:58:58
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-17 11:19:13
 * @FilePath: \Back-end-template\src\modules\auth\service\rbac.service.ts
 * @Description:
 */
import { EntityManager, In } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { Account } from '@/modules/auth/entity/account.entity';
import { AccountRole } from '@/modules/auth/entity/accountRole.entity';
import { Permission } from '@/modules/auth/entity/permission.entity';
import { Role } from '@/modules/auth/entity/role.entity';
import { RolePermission } from '@/modules/auth/entity/rolePermission.entity';

export const roleRepository = AppDataSource.getRepository(Role);
export const permissionRepository = AppDataSource.getRepository(Permission);
export const accountRoleRepository = AppDataSource.getRepository(AccountRole);
export const rolePermissionRepository = AppDataSource.getRepository(RolePermission);

const uniq = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

const getManager = (manager?: EntityManager) => manager || AppDataSource.manager;

/**
 * @description: 获取账号权限信息
 * @param {string} accountUid
 * @param {EntityManager} manager
 * @return {*}
 */
export const resolveAccountAuthorization = async (
  accountUid: string,
  manager?: EntityManager
): Promise<AccountAuthorizationContext> => {
  const entityManager = getManager(manager);
  const account = await entityManager.getRepository(Account).findOne({
    where: { uid: accountUid }
  });
  const accountRoles = await entityManager.getRepository(AccountRole).find({
    where: { account_uid: accountUid }
  });
  const roleIds = uniq(accountRoles.map((item) => item.role_id));

  // 获取账号角色
  const roleEntities = roleIds.length
    ? await entityManager.getRepository(Role).find({
      where: {
        id: In(roleIds),
        is_active: true
      }
    })
    : [];

  // 获取这个角色的详细权限
  const resolvedRoleIds = roleEntities.map((item) => item.id);
  const rolePermissions = resolvedRoleIds.length
    ? await entityManager.getRepository(RolePermission).find({
      where: { role_id: In(resolvedRoleIds) }
    })
    : [];
  const permissionIds = uniq(rolePermissions.map((item) => item.permission_id));

  const permissionEntities = permissionIds.length
    ? await entityManager.getRepository(Permission).find({
      where: {
        id: In(permissionIds),
        is_active: true
      }
    })
    : [];

  return {
    accountUid,
    corpId: account?.corp_id || null,
    roles: uniq(roleEntities.map((item) => item.code)),
    permissions: uniq(permissionEntities.map((item) => item.code))
  };
};

/**
 * @description: 根据 UID 获取角色权限信息
 * @param {any} req
 * @return {*}
 */
export const getRequestAuthorization = async (req: any): Promise<AccountAuthorizationContext> => {
  if (req.authorizationContext) {
    return req.authorizationContext;
  }

  const tokenInfo = req.getTokenInfo?.();
  if (!tokenInfo?.uid) {
    const emptyContext = {
      accountUid: '',
      corpId: null,
      roles: [],
      permissions: []
    };
    req.authorizationContext = emptyContext;
    req.getAuthorizationContext = async () => emptyContext;
    return emptyContext;
  }

  const authorizationContext = await resolveAccountAuthorization(tokenInfo.uid);
  req.authorizationContext = authorizationContext;
  req.getAuthorizationContext = async () => authorizationContext;

  return authorizationContext;
};
