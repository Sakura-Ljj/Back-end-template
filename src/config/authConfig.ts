/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-27 16:38:17
 * @FilePath: \Back-end-template\src\config\authConfig.ts
 * @Description: 
 */
export const JWT_SECRET = process.env.JWT_SECRET || 'replace-me';

export const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '2h';

export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

export const JWT_EXPIRES_IN = ACCESS_TOKEN_EXPIRES_IN;

// 随机账号的Secret
export const ACCOUNT_SECRET = 'defaultSecret'
