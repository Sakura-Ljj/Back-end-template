import { In, IsNull } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { REQUEST_PARAMS_ERROR_CODE } from '@/config/errorCode';
import { roleRepository } from '@/modules/auth/service/rbac.service';
import { appendTenantVisibilityCondition, getRequestCorpId, resolveWritableCorpId } from '@/modules/corp/service/tenant.service';
import { Route } from '@/modules/system/entity/route.entity';
import { RouteRole } from '@/modules/system/entity/routeRole.entity';
import { SaveRouteReq, RouteTreeItem } from '@/modules/system/interface';
import { myError } from '@/utils/errors';

export const routeRepository = AppDataSource.getRepository(Route);
export const routeRoleRepository = AppDataSource.getRepository(RouteRole);

/**
 * @description: 路由排序
 * @param {*} T
 * @return {*}
 */
const sortRoutes = <T extends { weight: number }>(items: T[]) => {
  return [...items].sort((a, b) => b.weight - a.weight);
};

/**
 * @description: 检测路由参数
 * @param {SaveRouteReq} payload
 * @param {any} req
 * @return {*}
 */
const assertRoutePayload = (payload: SaveRouteReq, req: any) => {
  if (!payload.path || !payload.name || !payload.title) {
    throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('request_params_error'));
  }
};

/**
 * @description: 递归检测是否存在路由挂载在自己的节点上面
 * @return {*}
 */
const assertNoRouteCycle = async (
  currentRouteId: string | undefined,
  parentId: string | undefined,
  req: any,
  repository: typeof routeRepository
) => {
  if (!currentRouteId || !parentId) {
    return;
  }

  let cursorId: string | null = parentId;
  while (cursorId) {
    if (cursorId === currentRouteId) {
      throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('request_params_error'));
    }

    const currentParent = await repository.findOne({
      where: { id: cursorId }
    });

    if (!currentParent) {
      break;
    }

    cursorId = currentParent.parent_id;
  }
};

const buildRouteTree = (routes: Route[]): RouteTreeItem[] => {
  const routeMap = new Map<string, RouteTreeItem>();
  const rootList: RouteTreeItem[] = [];

  routes.forEach((item) => {
    routeMap.set(item.id, {
      id: item.id,
      path: item.path,
      name: item.name,
      title: item.title,
      component: item.component_path,
      redirect: item.redirect,
      meta: {
        title: item.title,
        icon: item.icon,
        is_hide: item.is_hide,
        is_keep_alive: item.is_keep_alive,
        permission_code: item.permission_code,
        route_type: item.route_type
      },
      weight: item.weight,
      children: []
    });
  });

  routes.forEach((item) => {
    const currentItem = routeMap.get(item.id);
    if (!currentItem) {
      return;
    }

    if (!item.parent_id) {
      rootList.push(currentItem);
      return;
    }

    const parent = routeMap.get(item.parent_id);
    if (!parent) {
      rootList.push(currentItem);
      return;
    }

    parent.children.push(currentItem);
  });

  const sortTree = (items: RouteTreeItem[]) => {
    const sortedItems = sortRoutes(items);
    sortedItems.forEach((item) => {
      item.children = sortTree(item.children);
    });
    return sortedItems;
  };

  return sortTree(rootList);
};

/**
 * @description: 判断路由是否可见
 * @param {Route} route
 * @param {string} routeRoleIds
 * @param {string} roleIds
 * @param {string} permissions
 * @return {*}
 */
const isRouteVisible = (
  route: Route,
  routeRoleIds: string[],
  roleIds: string[],
  permissions: string[]
) => {
  const hasRoleConstraint = routeRoleIds.length > 0;
  const rolePassed = !hasRoleConstraint || routeRoleIds.some((roleId) => roleIds.includes(roleId));
  const permissionPassed = !route.permission_code || permissions.includes(route.permission_code);
  return rolePassed && permissionPassed;
};

/**
 * @description: 获取后台系统路由列表
 * @param {any} req
 * @return {*}
 */
export const getRouteAdminList = async (req: any) => {
  const corpId = getRequestCorpId(req);
  const routeQueryBuilder = routeRepository
    .createQueryBuilder('route')
    .orderBy('route.weight', 'DESC')
    .addOrderBy('route.create_at', 'ASC');

  appendTenantVisibilityCondition(routeQueryBuilder, 'route', corpId);
  const [routes, routeRoles, roles] = await Promise.all([
    routeQueryBuilder.getMany(),
    routeRoleRepository.find(),
    roleRepository.find({
      where: { is_active: true }
    })
  ]);

  const roleMap = new Map(roles.map((item) => [item.id, item]));

  return {
    list: routes.map((route) => {
      const bindings = routeRoles.filter((item) => item.route_id === route.id);
      return {
        ...route,
        role_ids: bindings.map((item) => item.role_id),
        role_codes: bindings
          .map((item) => roleMap.get(item.role_id)?.code || '')
          .filter(Boolean)
      };
    })
  };
};

/**
 * @description: 获取菜单
 * @param {AccountAuthorizationContext} authorization
 * @return {*}
 */
export const getRouteMenuTree = async (authorization: AccountAuthorizationContext) => {
  const corpId = authorization.corpId || null;
  const routeQueryBuilder = routeRepository
    .createQueryBuilder('route')
    .where('route.is_enabled = :isEnabled', { isEnabled: true })
    .orderBy('route.weight', 'DESC')
    .addOrderBy('route.create_at', 'ASC');

  appendTenantVisibilityCondition(routeQueryBuilder, 'route', corpId);
  const [routes, routeRoles, roles] = await Promise.all([
    routeQueryBuilder.getMany(),
    routeRoleRepository.find(),
    roleRepository.find({
      where: {
        code: In(authorization.roles),
        is_active: true
      }
    })
  ]);

  const currentRoleIds = roles.map((item) => item.id);
  const visibleRoutes = routes.filter((route) => {
    const routeRoleIds = routeRoles
      .filter((item) => item.route_id === route.id)
      .map((item) => item.role_id);
    return isRouteVisible(route, routeRoleIds, currentRoleIds, authorization.permissions);
  });

  return buildRouteTree(visibleRoutes);
};

/**
 * @description: 更新或新建路由
 * @param {SaveRouteReq} payload
 * @param {any} req
 * @return {*}
 */
export const saveRoute = async (payload: SaveRouteReq, req: any) => {
  assertRoutePayload(payload, req);

  // 使用事务保证不会出现因为报错而产生假数据
  return AppDataSource.transaction(async (manager) => {
    const corpId = resolveWritableCorpId(req, payload.corp_id || null);
    const nextRoleIds = Array.from(new Set((payload.role_ids || []).filter(Boolean)));

    // 检测路由路径是否存在
    const existedByPath = await manager.getRepository(Route).findOne({
      where: {
        path: payload.path!,
        corp_id: corpId || IsNull()
      }
    });
    if (existedByPath && existedByPath.id !== payload.id) {
      throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('route_path_exists'));
    }

    // 检测路由名称是否存在
    const existedByName = await manager.getRepository(Route).findOne({
      where: {
        name: payload.name!,
        corp_id: corpId || IsNull()
      }
    });
    if (existedByName && existedByName.id !== payload.id) {
      throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('route_name_exists'));
    }

    // 检测父路由是否存在以及挂载的父路由是否合法
    if (payload.parent_id) {
      const routeRepo = manager.getRepository(Route);
      const parent = await routeRepo.findOne({
        where: { id: payload.parent_id }
      });

      if (!parent || (payload.id && payload.id === parent.id)) {
        throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('request_params_error'));
      }

      await assertNoRouteCycle(payload.id, payload.parent_id, req, routeRepo);
    }

    const tokenInfo = req.requireTokenInfo?.();
    const updater = tokenInfo?.uid || 'system';
    let route = payload.id
      ? await manager.getRepository(Route).findOne({ where: { id: payload.id } })
      : null;

    const saveData = {
      path: payload.path!,
      name: payload.name!,
      title: payload.title!,
      corp_id: corpId,
      component_path: payload.component_path || null,
      is_keep_alive: !!payload.is_keep_alive,
      is_hide: !!payload.is_hide,
      icon: payload.icon || null,
      redirect: payload.redirect || null,
      parent_id: payload.parent_id || null,
      weight: payload.weight || 0,
      permission_code: payload.permission_code || null,
      route_type: payload.route_type || 'menu',
      is_enabled: payload.is_enabled !== false,
      remark: payload.remark || '',
      updater
    }

    if (!route) {
      route = manager.getRepository(Route).create({
        ...saveData,
        creator: updater,
      });
    } else {
      Object.assign(route, saveData)
    }

    route = await manager.getRepository(Route).save(route);

    // 删除旧的路由权限, 添加新的路由权限
    const existedBindings = await manager.getRepository(RouteRole).find({
      where: { route_id: route.id }
    });
    if (existedBindings.length) {
      await manager.getRepository(RouteRole).remove(existedBindings);
    }

    if (nextRoleIds.length) {
      await manager.getRepository(RouteRole).insert(
        nextRoleIds.map((roleId) => ({
          route_id: route!.id,
          role_id: roleId,
          creator: updater,
          updater
        }))
      );
    }

    return route;
  });
};
