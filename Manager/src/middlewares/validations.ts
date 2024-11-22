import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation chain for user preferences creation
export const ValidateCreateUserPreferences = [
  // Validate email
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .trim()
    .normalizeEmail(),

  // Validate telephone (optional but must be valid if provided)
  body('telephone')
    .optional()
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Telephone must be in E.164 format (e.g., +123456789)'),

  // Validate preferences object
  body('preferences')
    .exists()
    .withMessage('Preferences object is required')
    .isObject()
    .withMessage('Preferences must be an object'),

  // Validate preferences.email boolean field
  body('preferences.email')
    .isBoolean()
    .withMessage('preferences.email must be a boolean'),

  // Validate preferences.sms boolean field
  body('preferences.sms')
    .isBoolean()
    .withMessage('preferences.sms must be a boolean'),

  // Custom validation to ensure at least one contact method is enabled
  body()
    .custom((value) => {
      const hasEmail = value.email && value.preferences.email;
      const hasPhone = value.telephone && value.preferences.sms;
      
      if (!hasEmail && !hasPhone) {
        throw new Error('At least one contact method (email or telephone) must be provided');
      }
      return true;
    }),

  // Middleware to handle validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(err => ({
          type: err.type,
          message: err.msg
        }))
      });
    }
    next();
  }
];