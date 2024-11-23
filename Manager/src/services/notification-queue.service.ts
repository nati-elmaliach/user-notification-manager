import axios from 'axios';
import { NotificationStatus, NotificationType, QueuedNotification, QueuedNotificationConfig, SendNotificationResponse } from "../types";

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', second: '2-digit' })
}

export class NotificationQueueService {
  private tokens: number;
  private queue: QueuedNotification[] = [];
  private queueInterval: NodeJS.Timeout | null = null;
  
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
      payload,
      retries: 0,
      type: this.type,
    };

    return this.sendOrEnqueue(notification);
  }

  private async sendOrEnqueue(notification: QueuedNotification): Promise<SendNotificationResponse> {
    // We want to restart the process for the first request
    if (this.queue.length === 0 && this.tokens === this.config.bucketSize) {
      if(this.queueInterval) {
        clearInterval(this.queueInterval)
      }
      this.queueInterval = setInterval(() => this.processQueue(), this.config.windowMs + 1000); // Why do we need this delay ?
    }

    if (this.tokens > 0) {
      return await this.sendRequest(notification)
    }

    this.queue.push(notification);
    console.log(`Queue length: ${this.queue.length}, Adding message to queue: ${notification.payload.message}`)
    return { type: this.type, status: 'queued' }
  }
 
  private async sendRequest(notification: QueuedNotification) {
    console.log('Sending request at: ' + getTime() + ' ' + notification.payload.message);

    let status: NotificationStatus;

    try {
      this.tokens--;
      await axios.post(`${this.baseUrl}/send-${this.type}`, notification.payload);
      status = 'sent';
    } catch (error: any) {
      console.log('Retryring request at: ' + getTime() +` ${notification.payload.message}`);
      // Handle retries if the maximum retry count has not been reached
      if (notification.retries < this.config.maxRetries) {
        notification.retries++;
        return this.sendOrEnqueue(notification)
      } else { 
        // Mark as failed after exceeding retries
        status = 'failed';
        console.error(`Failed to send message of type ${this.type}, message: ${notification.payload.message}. Status: ${status}`);
      }
    }
    return { type: this.type, status };
  }

  private async processQueue() {
    console.log('Processing queue : ' + getTime());
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
}