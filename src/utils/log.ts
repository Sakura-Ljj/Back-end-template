import fs from 'fs';
import path from 'path';
import log4js from 'log4js';

const logDir = path.join(process.cwd(), 'logs');
fs.mkdirSync(logDir, { recursive: true });

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
      type: 'dateFile',
      filename: path.join(logDir, 'app'),
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      keepFileExt: true,
      numBackups: 30
    }
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'debug' }
  }
});

const baseLogger = log4js.getLogger();

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type LogContext = Record<string, unknown>;

const normalizeError = (error: unknown) => {
  if (!error) {
    return {};
  }

  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack || ''
    };
  }

  return {
    errorMessage: typeof error === 'string' ? error : JSON.stringify(error)
  };
};

const writeLog = (level: LogLevel, event: string, context: LogContext = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    event,
    ...context
  };

  (baseLogger as any)[level](JSON.stringify(payload));
};

const createLogger = (baseContext: LogContext = {}) => ({
  trace: (event: string, context: LogContext = {}) => writeLog('trace', event, { ...baseContext, ...context }),
  debug: (event: string, context: LogContext = {}) => writeLog('debug', event, { ...baseContext, ...context }),
  info: (event: string, context: LogContext = {}) => writeLog('info', event, { ...baseContext, ...context }),
  warn: (event: string, context: LogContext = {}) => writeLog('warn', event, { ...baseContext, ...context }),
  error: (event: string, error?: unknown, context: LogContext = {}) => {
    writeLog('error', event, {
      ...baseContext,
      ...context,
      ...normalizeError(error)
    });
  },
  fatal: (event: string, error?: unknown, context: LogContext = {}) => {
    writeLog('fatal', event, {
      ...baseContext,
      ...context,
      ...normalizeError(error)
    });
  },
  child: (context: LogContext) => createLogger({ ...baseContext, ...context })
});

const log = createLogger();

export default log;
