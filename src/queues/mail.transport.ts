import { IEmailLocals, winstonLogger } from '@danielkrsakzen/jobber-shared';
import { config } from '@notifications/config';
import { emailTemplates } from '@notifications/helpers';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServerMailTransport', 'debug');

export const sendEmail = async (template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> => {
  try {
    await emailTemplates(template, receiverEmail, locals);

    log.info('Email has been sent successfully');
  } catch (error) {
    log.log('error', 'NotificationService MailTransport sendEmail() method: ', error);
  }
};
