import path from 'path';

import { IEmailLocals, winstonLogger } from '@danielkrsakzen/jobber-shared';
import { Logger } from 'winston';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';
import { ConsumeMessage } from 'amqplib';

import { config } from './config';
import { sendEmail } from './queues/mail.transport';
import { EmailTemplate } from './queues/enums';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServerEmailHelper', 'debug');

export const emailTemplates = async (template: string, to: string, locals: IEmailLocals): Promise<void> => {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'easter.ullrich@ethereal.email',
        pass: 'pKJ7VpVJzjgcXXRfGe'
      }
    });

    const email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: transporter,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });

    await email.send({
      template: path.join(__dirname, '..', 'src/emails', template),
      message: { to },
      locals
    });
  } catch (error) {
    log.error(error);
  }
};

export const sendParsedEmail = async (msg: ConsumeMessage): Promise<void> => {
  const emailData = JSON.parse(msg.content.toString());

  const locals: IEmailLocals = {
    appLink: `${config.CLIENT_URL}`,
    appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
    ...emailData
  };

  if (emailData.template === EmailTemplate.ORDER_PLACED) {
    await sendEmail(EmailTemplate.ORDER_PLACED, emailData.receiverEmail, locals);
    await sendEmail(EmailTemplate.ORDER_RECEIPT, emailData.receiverEmail, locals);

    return;
  }

  await sendEmail(emailData.template, emailData.receiverEmail, locals);
};
