import { NotificationServiceResponse, UserPreferences } from "../types";
import { NotificationService } from "./notification.service";

export class UserPreferencesManager {
    private users: Map<number, UserPreferences>;
    private emailIndex: Map<string | undefined, number>;
    private currentId: number;
    private notificationService: NotificationService;
  
    constructor(notificationService: NotificationService) {
      // This can be a good place to fetch users preferences
      this.users = new Map();
      this.emailIndex = new Map();
      this.currentId = 0;
      this.notificationService = notificationService;
    }

    createUser(userData: Omit<UserPreferences, 'userId'>): UserPreferences {
      if (this.emailIndex.has(userData.email)) {
        throw new Error('User with this email already exists');
      }
  
      const userId = ++this.currentId;
      const newUser = Object.assign({ userId }, userData)
  
      this.users.set(userId, newUser);
      this.emailIndex.set(userData.email, userId);
  
      return newUser;
    }
  
    updatePreferences(email: string, preferences: UserPreferences['preferences']): UserPreferences {
      const userId = this.emailIndex.get(email);
      if (!userId) {
        throw new Error('User not found');
      }
  
      const user = this.users.get(userId)!;
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          ...preferences
        }
      };
  
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
  
    async sendNotification(userId: number, message: string): Promise<void> {
      const user = this.users.get(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
  
      const promises: Promise<NotificationServiceResponse>[] = [];
  
      if (user.email && user.preferences.email) {
        promises.push(this.notificationService.sendEmail(user.email, message));
      }
  
      if (user.telephone && user.preferences.sms) {
        promises.push(this.notificationService.sendSMS(user.telephone, message));
      }
  
      await Promise.all(promises);
    }
  }