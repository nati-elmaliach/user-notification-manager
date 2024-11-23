import axios from 'axios';
import { NotificationServiceResponse } from '../types';

export class NotificationService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5001') { // TODO move to ENV
    this.baseUrl = baseUrl;
  }

  async sendEmail(email: string, message: string): Promise<NotificationServiceResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/send-email`, { email, message });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendSMS(telephone: string, message: string): Promise<NotificationServiceResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/send-sms`, { telephone, message });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
}