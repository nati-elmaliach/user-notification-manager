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
  userId: number;
  message: string;
}

export interface PreferencesUpdateRequest {
  email: string;
  preferences: {
    email: boolean;
    sms: boolean;
  };
}

export interface NotificationServiceResponse {
  success: boolean;
  message: string;
}
