const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(bodyParser.json());

// Constants
const MAX_MESSAGE_LENGTH = 500;
const EMAIL_RATE_LIMIT = parseInt(process.env.EMAIL_RATE_LIMIT || "1", 10); // Default: 1 request/sec
const SMS_RATE_LIMIT = parseInt(process.env.SMS_RATE_LIMIT || "1", 10); // Default: 1 request/sec
const RATE_LIMIT_WINDOW_MS = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || "1000",
  10
); // Default: 1 second
const ERROR_RATE = parseFloat(process.env.ERROR_RATE || "0.1"); // Default: 10% error rate

// Middleware: Simulate random errors
const errorMiddleware = (req, res, next) => {
  if (Math.random() < ERROR_RATE) {
    return res.status(500).json({ error: "Random server error occurred." });
  }
  next();
};

// Email-specific rate limiter
const emailRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: EMAIL_RATE_LIMIT,
  message: {
    error: "Too many requests for /send-email, please try again later.",
  },
});

// SMS-specific rate limiter
const smsRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: SMS_RATE_LIMIT,
  message: {
    error: "Too many requests for /send-sms, please try again later.",
  },
});

// Email notification endpoint
app.post("/send-email", emailRateLimiter, errorMiddleware, (req, res) => {
  const { email, message } = req.body;

  // Input validation
  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (message.length === 0 || message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `Message length must be between 1 and ${MAX_MESSAGE_LENGTH} characters`,
    });
  }

  console.log(`Email sent to ${email}: ${message}`);
  res
    .status(200)
    .json({ status: "sent", channel: "email", to: email, message });
});

// SMS notification endpoint
app.post("/send-sms", smsRateLimiter, errorMiddleware, (req, res) => {
  const { telephone, message } = req.body;

  // Input validation
  if (!telephone || !message) {
    return res
      .status(400)
      .json({ error: "Telephone and message are required" });
  }
  if (!/^\+?[1-9]\d{1,14}$/.test(telephone)) {
    return res.status(400).json({ error: "Invalid telephone format" });
  }
  if (message.length === 0 || message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `Message length must be between 1 and ${MAX_MESSAGE_LENGTH} characters`,
    });
  }

  console.log(`SMS sent to ${telephone}: ${message}`);
  res
    .status(200)
    .json({ status: "sent", channel: "sms", to: telephone, message });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
  console.log(
    `Email Rate Limit: ${EMAIL_RATE_LIMIT} request(s) per ${
      RATE_LIMIT_WINDOW_MS / 1000
    } second(s)`
  );
  console.log(
    `SMS Rate Limit: ${SMS_RATE_LIMIT} request(s) per ${
      RATE_LIMIT_WINDOW_MS / 1000
    } second(s)`
  );
  console.log(`Error rate: ${ERROR_RATE * 100}%`);
});