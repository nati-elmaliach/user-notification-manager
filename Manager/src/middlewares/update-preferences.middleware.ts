import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation for updating preferences
export const ValidateUpdatePreferences = [
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

    body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object'),

    body('preferences.email')
    .isBoolean()
    .withMessage('preferences.email must be a boolean'),

    body('preferences.sms')
    .isBoolean()
    .withMessage('preferences.sms must be a boolean'),

    body('userId')
    .isEmpty()
    .withMessage('cannot update user id'),

      // Custom validation to ensure at least one contact method is enabled
  body()
  .custom((value) => { // TODO add type's
    const hasEmail = value.email;
    const hasPhone = value.telephone;
    const hasPreferences = value.preferences;
    
    if (!hasEmail && !hasPhone && !hasPreferences) {
      throw new Error('At least one be provided');
    }
    return true;
  }),

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
  