import express, { Express } from 'express';
import { winstonLogger } from '@danielkrsakzen/jobber-shared';
import { Logger } from 'winston';

import { config } from './config';
import { start } from './server';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

const initialize = (): void => {
  const app: Express = express();

  start(app);

  log.info('Notification server initialized');
};

initialize();
