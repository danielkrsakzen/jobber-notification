import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { IEmailLocals } from '@danielkrsakzen/jobber-shared';

import { BaseEmailConsumer } from './base-email-consumer';
import { ConnectionExchange, ConnectionQueueName, ConnectionRoutingKey } from './enums';
import { IAuthEmailMessageContent } from './interfaces';
import { sendEmail } from './mail.transport';

export class AuthEmailConsumer extends BaseEmailConsumer {
  exchangeName = ConnectionExchange.AUTH_EXCHANGE;
  routingKey = ConnectionRoutingKey.AUTH_ROUTING_KEY;
  queueName = ConnectionQueueName.AUTH_QUEUE_NAME;

  constructor(log: Logger, channel: Channel) {
    super(log, channel);
  }

  protected async processMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg) {
      return;
    }

    const msgContent: IAuthEmailMessageContent = JSON.parse(msg.content.toString());

    const locals: IEmailLocals = {
      appLink: `${config.CLIENT_URL}`,
      appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
      ...msgContent
    };

    try {
      await sendEmail(msgContent.template, msgContent.receiverEmail, locals);
      this.channel.ack(msg);
    } catch (error) {
      this.log.log('error', 'Failed to send auth email:', error);
    }
  }
}
