import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { AppDataSource } from '@/config/database';
import { APP_CONTEXT, APP_NAME, APP_PORT, ENABLE_WS } from '@/config/appConfig';
import customLocale from '@/middleware/customLocale';
import i18n from '@/i18n';
import { checkMethod } from '@/middleware/checkMethod';
import checkPermission from '@/middleware/checkPermission';
import checkRole from '@/middleware/checkRole';
import checkToken from '@/middleware/checkToken';
import requestContext from '@/middleware/requestContext';
import setRoute from '@/middleware/setRouter';
import { startTimedTasks } from '@/timedTasks';
import { scanDirModules } from '@/utils/routeScanner';
import { formatTime } from '@/utils/time';
import log from '@/utils/log';
import wsMiddleware from '@/middleware/ws';

const app = express();

app.use(cors({
  exposedHeaders: ['token', 'new_token', 'refresh-token'],
  allowedHeaders: [
    'Access-Control-Allow-Headers',
    'Origin',
    'X-Requested-With',
    'X-Language',
    'Content-Type',
    'Accept',
    'Authorization',
    'token',
    'refresh-token',
    'x-request-id'
  ]
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(customLocale);
app.use(i18n.init);
app.use(requestContext);

const controllers = scanDirModules(path.join(__dirname, 'modules/*/controller'));
for (const prefix in controllers) {
  const routeConfig = controllers[prefix];
  if (!routeConfig?.controller) {
    continue;
  }

  const {
    method,
    controller,
    unCheckToken = false,
    roles = [],
    permissions = [],
    renderType = 'json'
  } = routeConfig;

  const finalPath = APP_CONTEXT + prefix;
  log.info('http.route.registered', {
    method: method.toUpperCase(),
    path: finalPath,
    roles,
    permissions,
    unCheckToken
  });
  app.all(finalPath, checkToken(unCheckToken));
  app.all(finalPath, checkRole(roles));
  app.all(finalPath, checkPermission(permissions));
  app.all(finalPath, checkMethod(method), setRoute(method, controller, renderType));
}

const server = http.createServer(app);
if (ENABLE_WS) {
  wsMiddleware(server);
}

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    log.info('app.database.connected', { at: formatTime() });

    server.listen(APP_PORT, () => {
      log.info('app.server.started', { appName: APP_NAME, port: APP_PORT });
    });

    startTimedTasks();
  } catch (error) {
    log.error('app.start.failed', error);
    process.exit(1);
  }
};

startServer();

process.on('uncaughtException', (error: unknown) => {
  log.error('process.uncaughtException', error);
});

process.on('unhandledRejection', (error: unknown) => {
  log.error('process.unhandledRejection', error);
});
