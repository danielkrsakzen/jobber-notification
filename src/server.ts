import http from 'http';

import { winstonLogger } from '@danielkrsakzen/jobber-shared';
import { Channel } from 'amqplib';
import { Application } from 'express';
import 'express-async-errors';
import { Logger } from 'winston';

import { config } from './config';
import { checkConnection } from './elasticsearch';
import { createConnection } from './queues/connection';
import { consumeAuthEmailMessage, consumeOrderEmailMessages } from './queues/email.consumer';
import { healthRoute } from './routes';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export const start = (app: Application): void => {
  startServer(app);

  app.use(healthRoute);

  startQueues();
  startElasticSearch();
};

const startQueues = async (): Promise<void> => {
  const emailChannel = (await createConnection()) as Channel;

  await consumeAuthEmailMessage(emailChannel);
  await consumeOrderEmailMessages(emailChannel);
};

const startElasticSearch = (): void => {
  checkConnection();
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);

    log.info(`Worker with process id of ${process.pid} on notification server has started`);

    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method: ', error);
  }
};
