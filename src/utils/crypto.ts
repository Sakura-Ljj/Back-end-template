import crypto from 'crypto';
import { ACCOUNT_SECRET } from '@/config/serverConfig';

/**
 * @description: 密码加密
 * @param {string} password
 * @param {string} salt
 * @return {*}
 */
export const hashPassword = (password: string, salt?: string) => {
  const finalSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, finalSalt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: finalSalt,
    hash
  };
};

/**
 * @description: 验证密码
 * @param {string} password
 * @param {string} hash
 * @param {string} salt
 * @return {*}
 */
export const comparePassword = (password: string, hash: string, salt: string) => {
  return hashPassword(password, salt).hash === hash;
};

/**
 * @description: 生成唯一账号
 * @return {*}
 */
export const generateUniqueAccount = (length = 12): string => {
  // 组合随机因子：时间戳 + 随机数 + 环境变量
  const timestamp = Date.now().toString();
  const random = Math.random().toString();
  const secret = ACCOUNT_SECRET; // 可选：增强唯一性

  // 使用SHA-256哈希生成唯一字符串
  const hash = crypto
    .createHash('sha256')
    .update(timestamp + random + secret)
    .digest('hex'); // 输出16进制字符串

  // 截取指定长度
  return hash.substring(0, length);
}