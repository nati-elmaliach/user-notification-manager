export interface UserPreferences {
    userId: number;
    email?: string;
    telephone?: string;
    preferences: {
      email: boolean;
      sms: boolean;
    };
}

export interface CreateUserPreferencesRequest {
    email?: string;
    telephone?: string;
    preferences: {
      email: boolean;
      sms: boolean;
    };
  }