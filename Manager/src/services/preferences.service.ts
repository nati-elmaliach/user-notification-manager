import { NotificationServiceResponse, UpdateUserPreferencesRequest, UserPreferences } from "../types";
import { NotificationService } from "./notification.service";

export class UserPreferencesManager {
    private usersPreferences: Map<number, UserPreferences>;
    private emailIndex: Map<string | undefined, number>;
    private currentId: number;
    private notificationService: NotificationService;
  
    constructor(notificationService: NotificationService) {
      // This can be a good place to fetch users preferences
      this.usersPreferences = new Map();
      this.emailIndex = new Map();
      this.currentId = 0;
      this.notificationService = notificationService;
    }

    createUser(userData: Omit<UserPreferences, 'userId'>): UserPreferences {
      if (this.emailIndex.has(userData.email)) {
        throw new Error('User with this email already exists');
      }
  
      const userId = ++this.currentId;
      const newUser = Object.assign(userData, { userId })
  
      this.usersPreferences.set(userId, newUser);
      this.emailIndex.set(userData.email, userId);

      return newUser;
    }
  
    updatePreferences(userId: number, updateData: UpdateUserPreferencesRequest): UserPreferences {
      if (!userId) {
        throw new Error('user id is required');
      }
  
      const userPreferences = this.usersPreferences.get(userId);
      if (!userPreferences) {
        throw new Error(`Could not find a user with id ${userId}`)
      }
      
      // TODO handle duplicate emails and telepones ?

      const updatedUser = Object.assign(userPreferences, updateData)
      this.usersPreferences.set(userId, updatedUser);
      return updatedUser;
    }

    getByUserId(userId: number) {
      return this.usersPreferences.get(userId);
    }
  
    async sendNotification(userId: number, message: string): Promise<void> {
      const user = this.usersPreferences.get(userId);
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