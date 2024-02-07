import * as connection from '@notifications/queues/connection';
import { Channel } from 'amqplib';

import { consumeAuthEmailMessage } from '../email.consumer';
import { CommunicationType, ConnectionExchange, ConnectionQueueName, ConnectionRoutingKey } from '../enums';

jest.mock('@notifications/queues/connection');
jest.mock('amqplib');
jest.mock('@danielkrsakzen/jobber-shared');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('consumeAuthEmailMessage', () => {
  it('should be called', async () => {
    const channel = {
      assertExchange: jest.fn(),
      publish: jest.fn(),
      assertQueue: jest.fn(),
      bindQueue: jest.fn(),
      consume: jest.fn()
    };

    jest.spyOn(channel, 'assertExchange');
    jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: ConnectionQueueName.AUTH_QUEUE_NAME, messageCount: 0, consumerCount: 0 });
    jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);

    const connectionChannel: Channel | undefined = await connection.createConnection();

    await consumeAuthEmailMessage(connectionChannel!);

    expect(connectionChannel?.assertExchange).toHaveBeenCalledWith(ConnectionExchange.AUTH_EXCHANGE, CommunicationType.DIRECT);
    expect(connectionChannel?.assertQueue).toHaveBeenCalledTimes(1);
    expect(connectionChannel?.bindQueue).toHaveBeenCalledWith(
      ConnectionQueueName.AUTH_QUEUE_NAME,
      ConnectionExchange.AUTH_EXCHANGE,
      ConnectionRoutingKey.AUTH_ROUTING_KEY
    );
  });
});
