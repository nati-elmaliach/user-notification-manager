import axios from 'axios';
import { NotificationType, QueuedNotification, QueuedNotificationConfig } from "../types";



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
      await this.sendRequest(notification)
    } else {
      console.log(`Queue length: ${this.queue.length + 1}, Adding message to queue: ${payload.message}`)
      this.queue.push(notification);
    }
  }

  private async sendRequest(notification: QueuedNotification) {
    try {
      this.tokens--;
      await axios.post(`${this.baseUrl}/send-${this.type}`, notification.payload);
      console.log(`Message of type ${this.type} sent: ${notification.payload.message}`)
    } catch (error) {
      console.log(`Failed to send message of type ${this.type}, message: ${notification.payload.message}`)
      if (notification.retries < this.config.maxRetries) {
        notification.retries++;
        this.queue.push(notification);
      }
    } finally {
      if (this.queueInterval) {
        clearInterval(this.queueInterval)
      }
      this.queueInterval = setInterval(() => this.processQueue(), this.config.windowMs)
    }
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
    console.log(this.queue.length)
    // This can be a good place to notify message has being sent
  }
}