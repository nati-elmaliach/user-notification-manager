import { QueuedNotificationConfig } from '../types';
import { NotificationQueueService } from './notification-queue.service';

// This can be fetched or we can get it from headers
const SMS_RATE_LIMIT = Number(process.env.SMS_RATE_LIMIT || 3);
const EMAIL_RATE_LIMIT = Number(process.env.EMAIL_RATE_LIMIT || 3);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10000);

const smsConfig: QueuedNotificationConfig = {
  bucketSize: SMS_RATE_LIMIT, 
  windowMs: RATE_LIMIT_WINDOW_MS,
  maxRetries: 3
}

const emailConfig: QueuedNotificationConfig = {
  bucketSize: EMAIL_RATE_LIMIT, 
  windowMs: RATE_LIMIT_WINDOW_MS,
  maxRetries: 3
}


const NOTIFICATION_SERVICE_URL  =  process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5001';
export class NotificationService {
  private readonly emailQueueService: NotificationQueueService;
  private readonly smsQueueService: NotificationQueueService;

  constructor(baseUrl: string = NOTIFICATION_SERVICE_URL) {
    this.emailQueueService = new NotificationQueueService(baseUrl, 'email', emailConfig );
    this.smsQueueService = new NotificationQueueService(baseUrl, 'sms', smsConfig);
  }

  async sendEmail(email: string, message: string) {
    const result = await this.emailQueueService.sendNotification({ email, message });
    // This can be a good place to save message status
    return result;
  }

  async sendSMS(telephone: string, message: string) {
    const result = await this.smsQueueService.sendNotification({ telephone, message });
    // This can be a good place to save message status
    return result;
  }
}