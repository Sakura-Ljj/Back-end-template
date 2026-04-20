import crypto from 'crypto';

export const hashPassword = (password: string, salt?: string) => {
  const finalSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, finalSalt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: finalSalt,
    hash
  };
};

export const comparePassword = (password: string, hash: string, salt: string) => {
  return hashPassword(password, salt).hash === hash;
};