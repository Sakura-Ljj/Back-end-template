import crypto from 'crypto';
import WebSocket from 'ws';
import log from '@/utils/log';

export default (server: any) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
    const logger = log.child({
      requestId,
      clientIp: req.socket.remoteAddress || '',
      module: 'ws'
    });

    logger.info('ws.connection.open');
    ws.send(JSON.stringify({ type: 'connected', at: new Date().toISOString() }));

    ws.on('message', (message) => {
      logger.info('ws.message', { message: message.toString() });
    });
  });

  return wss;
};
