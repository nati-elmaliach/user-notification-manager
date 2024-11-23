import { NotificationService } from "./notification.service";
import { 
  NotificationRequest, 
  NotificationResponse, 
  NotificationServiceResponse, 
  UpdateUserPreferencesRequest, 
  UserPreferences 
} from "../types";

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
  
    async sendNotification( { userId, email, message } : NotificationRequest): Promise<NotificationResponse> {
      if (!userId) {
        userId = this.emailIndex.get(email)!; 
      }

      const userPreferences = this.usersPreferences.get(userId);
      if (!userPreferences) {
        throw new Error(`user not found`);
      }
      
      const response: NotificationResponse = { message }
      const sendEmail = userPreferences.email && userPreferences.preferences.email;
      if (sendEmail) {
        response.email = 'queued';
      }
  
      const sendSms = userPreferences.telephone && userPreferences.preferences.sms;
      if (sendSms) {
        response.sms = 'queued'
      }
  
      return response;
    }

    getByUserId(userId: number) {
      return this.usersPreferences.get(userId);
    }
  }