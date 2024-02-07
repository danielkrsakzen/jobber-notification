import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';

import { CommunicationType, ConnectionExchange, ConnectionQueueName, ConnectionRoutingKey } from './enums';
import { createConnection } from './connection';

export abstract class BaseEmailConsumer {
  protected log: Logger;
  protected channel: Channel;
  abstract exchangeName: ConnectionExchange;
  abstract routingKey: ConnectionRoutingKey;
  abstract queueName: ConnectionQueueName;

  constructor(log: Logger, channel: Channel) {
    this.log = log;
    this.channel = channel;
  }

  protected abstract processMessage(msg: ConsumeMessage | null): Promise<void>;

  public async consumeMessages(): Promise<void> {
    try {
      if (!this.channel) {
        this.channel = (await createConnection()) as Channel;
      }

      await this.channel.assertExchange(this.exchangeName, CommunicationType.DIRECT);

      const queue = await this.channel.assertQueue(this.queueName, {
        durable: true,
        autoDelete: false
      });

      await this.channel.bindQueue(queue.queue, this.exchangeName, this.routingKey);

      this.channel.consume(queue.queue, this.processMessage.bind(this));
    } catch (error) {
      this.log.error('Error setting up email consumer:', error);
    }
  }
}
