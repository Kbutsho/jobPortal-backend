const { default: rateLimit } = require("express-rate-limit");

module.exports.limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 10, // Limit each IP to 10 requests per `window` (here, per 5 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});