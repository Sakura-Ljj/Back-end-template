import 'reflect-metadata';
import { AppDataSource } from '@/config/database';
import { accountRepository } from '@/modules/auth/service/account.service';
import { AccountRole } from '@/modules/auth/entity/accountRole.entity';
import { Permission } from '@/modules/auth/entity/permission.entity';
import { Role } from '@/modules/auth/entity/role.entity';
import { RolePermission } from '@/modules/auth/entity/rolePermission.entity';
import { Corp } from '@/modules/corp/entity/corp.entity';
import { corpRepository } from '@/modules/corp/service/corp.service';
import { Route } from '@/modules/system/entity/route.entity';
import { RouteRole } from '@/modules/system/entity/routeRole.entity';
import { appConfigRepository, upsertConfig } from '@/modules/system/service/config.service';
import { hashPassword } from '@/utils/crypto';
import log from '@/utils/log';

const logger = log.child({ module: 'seedAdmin' });

const roleSeeds = [
  {
    code: 'admin',
    name: 'Administrator',
    description: 'Full access to all system resources'
  },
  {
    code: 'system_viewer',
    name: 'System Viewer',
    description: 'Read-only access to system configuration and permissions'
  }
];

const permissionSeeds = [
  {
    code: 'corp.read',
    name: 'Read Corp',
    module: 'corp',
    action: 'read',
    description: 'Read tenant corp list'
  },
  {
    code: 'corp.update',
    name: 'Update Corp',
    module: 'corp',
    action: 'update',
    description: 'Create or update tenant corp'
  },
  {
    code: 'auth.menu.read',
    name: 'Read Menu',
    module: 'auth',
    action: 'read',
    description: 'Read current user menu tree'
  },
  {
    code: 'auth.profile.read',
    name: 'Read Profile',
    module: 'auth',
    action: 'read',
    description: 'Read current login profile'
  },
  {
    code: 'system.config.read',
    name: 'Read Config',
    module: 'system',
    action: 'read',
    description: 'Read system config list'
  },
  {
    code: 'system.config.update',
    name: 'Update Config',
    module: 'system',
    action: 'update',
    description: 'Update system config'
  },
  {
    code: 'system.permission.read',
    name: 'Read Permission Summary',
    module: 'system',
    action: 'read',
    description: 'Read current permission summary'
  },
  {
    code: 'system.route.read',
    name: 'Read Route',
    module: 'system',
    action: 'read',
    description: 'Read frontend route config'
  },
  {
    code: 'system.route.update',
    name: 'Update Route',
    module: 'system',
    action: 'update',
    description: 'Create or update frontend route config'
  }
];

const rolePermissions: Record<string, string[]> = {
  admin: permissionSeeds.map((item) => item.code),
  system_viewer: [
    'auth.menu.read',
    'auth.profile.read',
    'system.config.read',
    'system.permission.read',
    'system.route.read'
  ]
};

const routeSeeds = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    title: 'Dashboard',
    component_path: 'pages/dashboard/index.vue',
    is_keep_alive: true,
    is_hide: false,
    icon: 'dashboard',
    redirect: null,
    parent_path: null,
    weight: 100,
    permission_code: null,
    route_type: 'menu' as const,
    is_enabled: true,
    remark: 'Default dashboard route',
    role_codes: [] as string[]
  },
  {
    path: '/system',
    name: 'System',
    title: 'System',
    component_path: 'pages/system/index.vue',
    is_keep_alive: false,
    is_hide: false,
    icon: 'setting',
    redirect: '/system/config',
    parent_path: null,
    weight: 90,
    permission_code: null,
    route_type: 'menu' as const,
    is_enabled: true,
    remark: 'System management root',
    role_codes: [] as string[]
  },
  {
    path: '/system/config',
    name: 'SystemConfig',
    title: 'Config',
    component_path: 'pages/system/config/index.vue',
    is_keep_alive: true,
    is_hide: false,
    icon: 'tool',
    redirect: null,
    parent_path: '/system',
    weight: 80,
    permission_code: 'system.config.read',
    route_type: 'page' as const,
    is_enabled: true,
    remark: 'System config route',
    role_codes: ['admin', 'system_viewer']
  },
  {
    path: '/system/routes',
    name: 'SystemRoutes',
    title: 'Routes',
    component_path: 'pages/system/routes/index.vue',
    is_keep_alive: true,
    is_hide: false,
    icon: 'route',
    redirect: null,
    parent_path: '/system',
    weight: 70,
    permission_code: 'system.route.read',
    route_type: 'page' as const,
    is_enabled: true,
    remark: 'Frontend route management',
    role_codes: ['admin', 'system_viewer']
  },
  {
    path: '/corp/list',
    name: 'CorpList',
    title: 'Tenants',
    component_path: 'pages/corp/list/index.vue',
    is_keep_alive: true,
    is_hide: false,
    icon: 'company',
    redirect: null,
    parent_path: null,
    weight: 60,
    permission_code: 'corp.read',
    route_type: 'page' as const,
    is_enabled: true,
    remark: 'Tenant management route',
    role_codes: ['admin']
  }
];

const corpSeeds = [
  {
    corp_id: 'demo-corp',
    corp_name: 'Demo Corp',
    is_enabled: true,
    remark: 'Seeded demo tenant'
  }
];

const seedAdmin = async () => {
  await AppDataSource.initialize();

  const roleRepository = AppDataSource.getRepository(Role);
  const permissionRepository = AppDataSource.getRepository(Permission);
  const accountRoleRepository = AppDataSource.getRepository(AccountRole);
  const rolePermissionRepository = AppDataSource.getRepository(RolePermission);
  const localRouteRepository = AppDataSource.getRepository(Route);
  const localRouteRoleRepository = AppDataSource.getRepository(RouteRole);

  for (const corpSeed of corpSeeds) {
    let corp = await corpRepository.findOne({
      where: { corp_id: corpSeed.corp_id }
    });

    if (!corp) {
      corp = corpRepository.create({
        ...corpSeed,
        creator: 'system',
        updater: 'system'
      });
    } else {
      corp.corp_name = corpSeed.corp_name;
      corp.is_enabled = corpSeed.is_enabled;
      corp.remark = corpSeed.remark;
      corp.updater = 'system';
    }

    await corpRepository.save(corp);
  }

  for (const roleSeed of roleSeeds) {
    let role = await roleRepository.findOne({ where: { code: roleSeed.code } });
    if (!role) {
      role = roleRepository.create({
        ...roleSeed,
        is_active: true,
        creator: 'system',
        updater: 'system'
      });
    } else {
      role.name = roleSeed.name;
      role.description = roleSeed.description;
      role.is_active = true;
      role.updater = 'system';
    }

    await roleRepository.save(role);
  }

  for (const permissionSeed of permissionSeeds) {
    let permission = await permissionRepository.findOne({ where: { code: permissionSeed.code } });
    if (!permission) {
      permission = permissionRepository.create({
        ...permissionSeed,
        type: 'api',
        is_active: true,
        creator: 'system',
        updater: 'system'
      });
    } else {
      permission.name = permissionSeed.name;
      permission.module = permissionSeed.module;
      permission.action = permissionSeed.action;
      permission.description = permissionSeed.description;
      permission.type = 'api';
      permission.is_active = true;
      permission.updater = 'system';
    }

    await permissionRepository.save(permission);
  }

  const allRoles = await roleRepository.find();
  const allPermissions = await permissionRepository.find();
  const roleMap = new Map(allRoles.map((item) => [item.code, item]));
  const permissionMap = new Map(allPermissions.map((item) => [item.code, item]));

  for (const [roleCode, permissionCodes] of Object.entries(rolePermissions)) {
    const role = roleMap.get(roleCode);
    if (!role) {
      continue;
    }

    for (const permissionCode of permissionCodes) {
      const permission = permissionMap.get(permissionCode);
      if (!permission) {
        continue;
      }

      const relation = await rolePermissionRepository.findOne({
        where: {
          role_id: role.id,
          permission_id: permission.id
        }
      });

      if (!relation) {
        await rolePermissionRepository.insert({
          role_id: role.id,
          permission_id: permission.id,
          creator: 'system',
          updater: 'system'
        });
      }
    }
  }

  let adminAccount = await accountRepository.findOne({ where: { account: 'admin' } });
  if (!adminAccount) {
    const passwordInfo = hashPassword('123456');
    adminAccount = accountRepository.create({
      account: 'admin',
      username: 'Administrator',
      password_hash: passwordInfo.hash,
      password_salt: passwordInfo.salt,
      corp_id: null,
      is_active: true,
      creator: 'system',
      updater: 'system'
    });
  } else {
    adminAccount.is_active = true;
    adminAccount.updater = 'system';
  }

  adminAccount = await accountRepository.save(adminAccount);

  let tenantViewerAccount = await accountRepository.findOne({ where: { account: 'demo_viewer' } });
  if (!tenantViewerAccount) {
    const passwordInfo = hashPassword('123456');
    tenantViewerAccount = accountRepository.create({
      account: 'demo_viewer',
      username: 'Demo Viewer',
      password_hash: passwordInfo.hash,
      password_salt: passwordInfo.salt,
      corp_id: 'demo-corp',
      is_active: true,
      creator: 'system',
      updater: 'system'
    });
  } else {
    tenantViewerAccount.corp_id = 'demo-corp';
    tenantViewerAccount.is_active = true;
    tenantViewerAccount.updater = 'system';
  }

  tenantViewerAccount = await accountRepository.save(tenantViewerAccount);

  const adminRole = roleMap.get('admin');
  if (adminRole) {
    const relation = await accountRoleRepository.findOne({
      where: {
        account_uid: adminAccount.uid,
        role_id: adminRole.id
      }
    });

    if (!relation) {
      await accountRoleRepository.insert({
        account_uid: adminAccount.uid,
        role_id: adminRole.id,
        creator: 'system',
        updater: 'system'
      });
    }
  }

  const viewerRole = roleMap.get('system_viewer');
  if (viewerRole) {
    const relation = await accountRoleRepository.findOne({
      where: {
        account_uid: tenantViewerAccount.uid,
        role_id: viewerRole.id
      }
    });

    if (!relation) {
      await accountRoleRepository.insert({
        account_uid: tenantViewerAccount.uid,
        role_id: viewerRole.id,
        creator: 'system',
        updater: 'system'
      });
    }
  }

  const configCount = await appConfigRepository.count();
  if (!configCount) {
    await upsertConfig('site_name', 'Backend Template', 'Default site name', 'system', undefined, null);
    await upsertConfig('maintenance_mode', 'false', 'Maintenance flag', 'system', undefined, null);
    await upsertConfig('site_name', 'Demo Tenant Template', 'Tenant scoped site name', 'system', undefined, 'demo-corp');
  }

  const routePathMap = new Map<string, Route>();
  for (const routeSeed of routeSeeds) {
    let route = await localRouteRepository.findOne({
      where: { path: routeSeed.path }
    });

    const parentId = routeSeed.parent_path ? routePathMap.get(routeSeed.parent_path)?.id || null : null;
    if (!route) {
      route = localRouteRepository.create({
        path: routeSeed.path,
        name: routeSeed.name,
        title: routeSeed.title,
        corp_id: null,
        component_path: routeSeed.component_path,
        is_keep_alive: routeSeed.is_keep_alive,
        is_hide: routeSeed.is_hide,
        icon: routeSeed.icon,
        redirect: routeSeed.redirect,
        parent_id: parentId,
        weight: routeSeed.weight,
        permission_code: routeSeed.permission_code,
        route_type: routeSeed.route_type,
        is_enabled: routeSeed.is_enabled,
        remark: routeSeed.remark,
        creator: 'system',
        updater: 'system'
      });
    } else {
      route.name = routeSeed.name;
      route.title = routeSeed.title;
      route.corp_id = null;
      route.component_path = routeSeed.component_path;
      route.is_keep_alive = routeSeed.is_keep_alive;
      route.is_hide = routeSeed.is_hide;
      route.icon = routeSeed.icon;
      route.redirect = routeSeed.redirect;
      route.parent_id = parentId;
      route.weight = routeSeed.weight;
      route.permission_code = routeSeed.permission_code;
      route.route_type = routeSeed.route_type;
      route.is_enabled = routeSeed.is_enabled;
      route.remark = routeSeed.remark;
      route.updater = 'system';
    }

    route = await localRouteRepository.save(route);
    routePathMap.set(route.path, route);

    const existedBindings = await localRouteRoleRepository.find({
      where: { route_id: route.id }
    });
    if (existedBindings.length) {
      await localRouteRoleRepository.remove(existedBindings);
    }

    const roleIds = routeSeed.role_codes
      .map((roleCode) => roleMap.get(roleCode)?.id || '')
      .filter(Boolean);

    if (roleIds.length) {
      await localRouteRoleRepository.insert(
        roleIds.map((roleId) => ({
          route_id: route!.id,
          role_id: roleId,
          creator: 'system',
          updater: 'system'
        }))
      );
    }
  }

  logger.info('seedAdmin.completed', {
    account: 'admin',
    tenantAccount: 'demo_viewer',
    corpIds: corpSeeds.map((item) => item.corp_id),
    roles: Array.from(roleMap.keys()),
    permissions: Array.from(permissionMap.keys()),
    routes: routeSeeds.map((item) => item.path)
  });
  await AppDataSource.destroy();
};

seedAdmin().catch(async (error) => {
  logger.error('seedAdmin.failed', error);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
