import { winstonLogger } from '@danielkrsakzen/jobber-shared';
import { config } from '@notifications/config';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export const createConnection = async (): Promise<Channel | undefined> => {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();

    closeConnection(connection, channel);

    log.info('Notification server connected to queue successfully');

    return channel;
  } catch (error) {
    log.log('error', 'NotificationServer createConnection() method: ', error);

    return;
  }
};

const closeConnection = (connection: Connection, channel: Channel) => {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });

  process.once('SIGTERM', async () => {
    await channel.close();
    await connection.close();
  });
};
