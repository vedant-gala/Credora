import express from 'express';
import helmet from 'helmet';
//-------------------------------------------------------------------------------------------
// Helmet (Security Middleware)
//
// This middleware helps secure the Express application by setting various HTTP headers.
//
// Without Helmet, the application would:
// - Be vulnerable to XSS attacks
// - Be susceptible to clickjacking
// - Potentially leak information through headers
// - Not enforce HTTPS usage
// - Be easier to exploit through various injection attacks
//
// Benefits : 
// - Protects against common web vulnerabilities (XSS, CSRF, etc.)
// - Prevents data leakage (exposing sensitive information)
// - Enhances security posture (reduces attack surface)
// - Improves compliance with security standards (e.g., GDPR, PCI DSS)
//-------------------------------------------------------------------------------------------
function helmetMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {

    // Define the options for the Helmet function
    const helmetOptions = {
        // The content security policy is a security feature that prevents XSS attacks
        // In our case, we don't want to use a content security policy : TODO @vedant-gala
        contentSecurityPolicy: false,
    }

    // Call the helmet function with the options supplied above
    const helmetOutput = helmet(helmetOptions);

    console.log('Helmet Middleware called');

    // The Helmet function returns another function, so we call it with the request, response and next inputs
    // and return as the output of this function
    return helmetOutput(req, res, next);
}

// Export the Helmet middleware function
export default helmetMiddleware;