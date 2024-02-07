import { winstonLogger } from '@danielkrsakzen/jobber-shared';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthHealthResponseBody } from '@elastic/elasticsearch/lib/api/types';
import { Logger } from 'winston';

import { config } from './config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServerElasticSearch', 'debug');

const esClient: Client = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

export const checkConnection = async (): Promise<void> => {
  let isConnected: boolean = false;

  while (!isConnected) {
    try {
      const health: ClusterHealthHealthResponseBody = await esClient.cluster.health({});

      log.info(`NotificationService ElasticSearch health status - ${health.status}`);

      isConnected = true;
    } catch (error) {
      log.error('Connection to ElasticSearch failed. Retrying...');
      log.log('error', 'NotificationServer checkConnection() method: ', error);
    }
  }
};
