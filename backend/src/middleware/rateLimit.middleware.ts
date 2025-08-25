import rateLimit from 'express-rate-limit';

//-------------------------------------------------------------------------------------------
// Rate Limit Middleware
//
// This middleware is used to limit the number of requests to the API.
//
// Without Rate Limit Middleware, the application would:
// - Be vulnerable to DDoS attacks
// - Be vulnerable to brute force attacks
// - Be vulnerable to rate limiting attacks
//
// Benefits : 
// - Protects against API abuse
//-------------------------------------------------------------------------------------------
function CreateRateLimitMiddleware() {
    // Define the options for the rate limit function
    // 'windowMs': The time frame for which requests are checked/remembered (in milliseconds).
    //             It is set from the RATE_LIMIT_WINDOW_MS environment variable, or defaults to 15 minutes (900000 ms).
    // 'max': The maximum number of requests allowed from a single IP during the window.
    //        It is set from the RATE_LIMIT_MAX_REQUESTS environment variable, or defaults to 100 requests.
    // 'message': The response message sent when the rate limit is exceeded.
    const rateLimitOptions = {
        windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'),
        max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'),
        message: 'Too many requests from this IP, please try again later.'
    }

    // Call the rate limit function with the options supplied above
    const rateLimitOutput = rateLimit(rateLimitOptions);

    console.log('Rate Limit Middleware created');

    // Return the rate limiter that is created using the options supplied above
    return rateLimitOutput;
}

// Export the rate limit middleware function
export default CreateRateLimitMiddleware;