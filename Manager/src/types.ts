// Preferences and User Preferences
export interface Preferences {
  email: boolean;
  sms: boolean;
}

export interface UserPreferences {
  userId: number;
  email?: string;
  telephone?: string;
  preferences: Preferences;
}

// Request Types
export type CreateUserPreferencesRequest = Omit<UserPreferences, 'userId'>;
export type UpdateUserPreferencesRequest = Omit<CreateUserPreferencesRequest, 'preferences'> & {
  preferences?: Preferences;
};

export interface NotificationRequest {
  userId?: number;
  email?: string;
  message: string;
}

// Notification Types and Statuses
export type NotificationType = 'email' | 'sms';
export type NotificationStatus = 'sent' | 'queued' | 'failed';

// Queued Notifications
export interface QueuedNotification {
  type: NotificationType;
  payload: {
    email?: string;
    telephone?: string;
    message: string;
  };
  retries: number;
}

export interface QueuedNotificationConfig {
  bucketSize: number;
  windowMs: number;
  maxRetries: number;
}
