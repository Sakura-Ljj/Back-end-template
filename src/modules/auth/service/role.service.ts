/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-29 13:58:33
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-29 18:10:50
 * @FilePath: \Back-end-template\src\modules\auth\service\role.service.ts
 * @Description: 
 */

import { myError } from '@/utils/errors';
import { SaveRoleReq, AccountBindRoleReq } from '../interface';
import { REQUEST_PARAMS_ERROR_CODE } from '@/config/errorCode';
import { roleRepository, accountRoleRepository } from './rbac.service';
import _ from 'underscore';

export const saveRole = async (payload: SaveRoleReq, req: any) => {
  let roleData = payload.id ? await roleRepository.findOne({
    where: {
      id: payload.id
    }
  }) : null

  const data = {
    name: payload.name,
    description: payload.description,
    is_active: payload.is_active ?? true
  }
  if (roleData) {
    Object.assign(roleData, _.omit(data, (value) => _.isUndefined(value)))
  } else {
    if (!payload.name || !payload.code) {
      throw myError(REQUEST_PARAMS_ERROR_CODE, req.__('request_params_error'))
    }

    roleData = roleRepository.create({
      ...data,
      code: payload.code,
    })
  }

  return roleRepository.save(roleData)
}

export const accountBindRole = (payload: AccountBindRoleReq) => {
  return accountRoleRepository.insert({
    account_uid: payload.account_uid,
    role_id: payload.role_id
  })
}