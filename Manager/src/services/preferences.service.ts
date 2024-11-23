import { NotificationService } from "./notification.service";
import { 
  UserPreferences,
  NotificationRequest,
  UpdateUserPreferencesRequest, 
} from "../types";

export class UserPreferencesManager {
    private usersPreferences: Map<number, UserPreferences>;
    private emailIndex: Map<string | undefined, number>;
    private currentId: number;
    private notificationService: NotificationService;
  
    constructor() {
      // This can be a good place to fetch users preferences from an extenrnal api
      this.usersPreferences = new Map();
      this.emailIndex = new Map();
      this.currentId = 0;
      this.notificationService = new NotificationService();
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
      const userPreferences = this.usersPreferences.get(userId);
      if (!userPreferences) {
        throw new Error(`Could not find a user with id ${userId}`)
      }
      
      // TODO handle duplicate emails and telepones ?

      const updatedUser = Object.assign(userPreferences, updateData)
      this.usersPreferences.set(userId, updatedUser);
      return updatedUser;
    }
  
    async sendNotification(notification: NotificationRequest) {
      const userId = notification.userId ?? this.emailIndex.get(notification.email);
      const userPreferences = this.usersPreferences.get(userId!);
      if (!userPreferences) {
        throw new Error(`Could not find a user with id ${userId}`);
      }

      const promises = [];
      const { email, telephone, preferences } = userPreferences;

      const sendEmail = email && preferences.email;
      if (sendEmail) {
        promises.push(this.notificationService.sendEmail(email, notification.message));
      }
  
      const sendSms = telephone && preferences.sms;
      if (sendSms) {
        promises.push(this.notificationService.sendSMS(telephone, notification.message))
      }
      
      return Promise.all(promises);
    }

    getByUserId(userId: number) {
      return this.usersPreferences.get(userId);
    }
  }