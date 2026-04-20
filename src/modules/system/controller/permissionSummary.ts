import { getRequestAuthorization } from '@/modules/auth/service/rbac.service';

module.exports = {
  method: 'get',
  permissions: ['system.permission.read'],
  controller: async (event: any, req: any) => {
    const authorization = await getRequestAuthorization(req);

    return {
      roles: authorization.roles,
      permissions: authorization.permissions
    };
  }
};
