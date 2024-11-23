import axios from 'axios';
import { NotificationStatus, NotificationType, QueuedNotification, QueuedNotificationConfig } from "../types";

export class NotificationQueueService {
  private tokens: number;
  private queue: QueuedNotification[] = [];
  private queueInterval: NodeJS.Timeout | undefined;
  
  constructor(
    private readonly baseUrl: string,
    private readonly type: NotificationType,
    private readonly config: QueuedNotificationConfig
  ) {
     console.log(type, config)
     this.tokens = config.bucketSize;
  }

  public async sendNotification(payload: QueuedNotification["payload"]) {
    const notification: QueuedNotification = {
      type: this.type,
      payload,
      retries: 0
    };

    if (this.tokens > 0) {
      return await this.sendRequest(notification)
    }

    this.queue.push(notification);
    console.log(`Queue length: ${this.queue.length}, Adding message to queue: ${payload.message}`)
    return { type: this.type, status: 'queued' }
  }

  private async sendRequest(notification: QueuedNotification) {
    let status: NotificationStatus;

    try {
      this.tokens--;
      await axios.post(`${this.baseUrl}/send-${this.type}`, notification.payload);
      status = 'sent';
      console.log(`Message of type ${this.type} sent: ${notification.payload.message}`);
    } catch (error) {
      // Handle retries if the maximum retry count has not been reached
      if (notification.retries < this.config.maxRetries) {
        notification.retries++;
        this.queue.push(notification);
        status = 'queued';
      } else {
        // Mark as failed after exceeding retries
        status = 'failed';
        console.error(`Failed to send message of type ${this.type}, message: ${notification.payload.message}. Status: ${status}`);
      }
    } finally {
      this.resetQueueInterval();
    }
    return { type: this.type, status };
  }

  private async processQueue() {
    this.tokens = this.config.bucketSize;

    const queueSize = this.queue.length;
    if (queueSize === 0) return;

    const maxMessagesToProcess = Math.min(queueSize, this.tokens);
    const messagesToSend = this.queue.splice(0, maxMessagesToProcess);

    const results = await Promise.allSettled(
      messagesToSend.map(notification => this.sendRequest(notification))
    )

    console.log(results)
    // This can be a good place to notify queued message has being sent
  }

  private resetQueueInterval(): void {
    if (this.queueInterval) {
      clearInterval(this.queueInterval);
    }
    this.queueInterval = setInterval(() => this.processQueue(), this.config.windowMs);
  }
}