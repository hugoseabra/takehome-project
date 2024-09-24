// Rate limiter mock for a service
import {rateLimit} from "express-rate-limit";

export const ratePerMinute = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 minute
  max: 1,
  legacyHeaders: false,
  handler: (req, res) => {
    res
      .status(429)
      .send({ message: "Too many requests, please try again later." });
  },
});


export const ratePerDay = rateLimit({
  windowMs: 84600000, // 1 day
  max: 100,
  statusCode: 429,
  legacyHeaders: false,
  skipFailedRequests: true,
  message: "You've reached the maximum number of requests for today. Wait 24h to try again.",
});
