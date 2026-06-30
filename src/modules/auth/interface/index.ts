/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-29 17:58:46
 * @FilePath: \Back-end-template\src\modules\auth\interface\index.ts
 * @Description: 
 */
export interface LoginReq {
  account: string;
  password: string;
}

export interface RefreshTokenReq {
  refreshToken: string;
}

export interface CreateAccountReq {
  corp_id?: string
  count?: number
}

export interface CreateAccountPayload {
  account: string
  password: string
  corp_id?: string
}

export interface SaveRoleReq {
  id?: string
  code?: string
  name?: string
  description?: string
  is_active?: boolean
}

export interface AccountBindRoleReq {
  account_uid: string
  role_id: string
}
