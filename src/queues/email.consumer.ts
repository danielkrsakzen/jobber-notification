import { winstonLogger } from '@danielkrsakzen/jobber-shared';
import { config } from '@notifications/config';
import { Channel } from 'amqplib';
import { Logger } from 'winston';

import { AuthEmailConsumer } from './auth-email-consumer';
import { OrderEmailConsumer } from './order-email-consumer';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServerEmailConsumer', 'debug');

export const consumeAuthEmailMessage = async (channel: Channel): Promise<void> => {
  const authEmailConsumer = new AuthEmailConsumer(log, channel);

  await authEmailConsumer.consumeMessages();
};

export const consumeOrderEmailMessages = async (channel: Channel): Promise<void> => {
  const orderEmailConsumer = new OrderEmailConsumer(log, channel);

  await orderEmailConsumer.consumeMessages();
};
