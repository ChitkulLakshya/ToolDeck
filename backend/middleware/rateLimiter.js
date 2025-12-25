import rateLimit from 'express-rate-limit';

// Create a limiter for AI generation endpoints
// Limit to 10 requests per 15 minutes per IP
export const aiGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: "Too many requests",
    details: "You have exceeded the request limit for AI generation. Please try again in 15 minutes."
  }
});
