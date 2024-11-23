import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation for updating preferences
export const ValidateSendNotificationRequest = [
    body('message')
    .exists()
    .withMessage('you must provide a message'),

    body('email')   
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .trim()
    .normalizeEmail(),

    body('userId')
    .optional(),

      // Custom validation to ensure at least one contact method is enabled
  body()
  .custom((value) => { // TODO add type's
    const hasEmail = value.email;
    const hasUserId = value.userId;
    
    if (!hasEmail && !hasUserId) {
      throw new Error('Could not identify user, email or userId is required');
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
  