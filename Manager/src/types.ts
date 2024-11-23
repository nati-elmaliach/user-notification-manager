interface Preferences {
  email: boolean;
  sms: boolean
}
export interface UserPreferences {
    userId: number;
    email?: string;
    telephone?: string;
    preferences: Preferences
}

export type CreateUserPreferencesRequest = Omit<UserPreferences, 'userId'>
export type UpdateUserPreferencesRequest = Omit<CreateUserPreferencesRequest, 'preferences'> & {
  preferences?: Preferences;
};

export interface NotificationRequest {
  userId?: number;
  email?: string;
  message: string;
}

export type NotificationResponseType = 'sent' | 'queued' | 'failed';
export interface SendNotificationResponse {
  email?: { status: NotificationResponseType };
  sms?: { status: NotificationResponseType }
}

export type NotificationType = 'email' | 'sms';
export interface QueuedNotification {
  type: NotificationType
  payload: {
    email?: string;
    telephone?: string;
    message: string;
  };
  retries: number;
}

export interface QueuedNotificationConfig {
  bucketSize: number,
  windowMs: number,
  maxRetries: number
}