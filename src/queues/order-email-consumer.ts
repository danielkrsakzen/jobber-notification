import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { IEmailLocals } from '@danielkrsakzen/jobber-shared';

import { BaseEmailConsumer } from './base-email-consumer';
import { ConnectionExchange, ConnectionQueueName, ConnectionRoutingKey, EmailTemplate } from './enums';
import { IOrderEmailMessageContent } from './interfaces';
import { sendEmail } from './mail.transport';

export class OrderEmailConsumer extends BaseEmailConsumer {
  exchangeName = ConnectionExchange.ORDER_EXCHANGE;
  routingKey = ConnectionRoutingKey.ORDER_ROUTING_KEY;
  queueName = ConnectionQueueName.ORDER_QUEUE_NAME;

  constructor(log: Logger, channel: Channel) {
    super(log, channel);
  }

  protected async processMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg) {
      return;
    }

    const msgContent: IOrderEmailMessageContent = JSON.parse(msg.content.toString());

    const locals: IEmailLocals = {
      appLink: `${config.CLIENT_URL}`,
      appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
      ...msgContent
    };

    try {
      if (msgContent.template === EmailTemplate.ORDER_PLACED) {
        await sendEmail(EmailTemplate.ORDER_PLACED, msgContent.receiverEmail, locals);
        await sendEmail(EmailTemplate.ORDER_RECEIPT, msgContent.receiverEmail, locals);

        return;
      }

      await sendEmail(msgContent.template, msgContent.receiverEmail, locals);

      this.channel.ack(msg);
    } catch (error) {
      this.log.log('error', 'Failed to send order email:', error);
    }
  }
}
