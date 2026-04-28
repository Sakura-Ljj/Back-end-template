export const SERVER_HOST = process.env.NODE_ENV === 'development'
  ? process.env.DEV_HOST
  : process.env.PRO_HOST;

export const APP_CONTEXT = process.env.APP_CONTEXT || '/api';

export const APP_NAME = process.env.APP_NAME || 'backend-template';

export const APP_PORT = Number(process.env.APP_PORT || 8787);

export const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'zh';

export const ENABLE_WS = process.env.ENABLE_WS === 'true';
