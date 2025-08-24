//=========================================================================================
// File : app.ts
// Description : This file supplies the application for the backend server.
//
// Purpose : 
//   Express app setup : It creates and Configures an Express application
//   Middleware configuration : Sets up all middleware (CORS, Helmet, Rate-Limiting, Compression etc.)
//   Route Registration : Mounts API routes and handles 404s
//   Error Handling : Configures error Middleware
//   Exports : It exports the Configured express application
//
// Benefits of keeping it separate from server.ts : 
//  Testability     - Can import app in tests without starting the actual server
//                  - Can run the express app without database connections
//  Reusability     - The app can be imported and used in different contexts
//                  - Can potentially run the same app with different server configurations
//  Maintainability - Clear separation between app logic and server infrastructure
//                  - Easier to modify server behaviour without touching app configuration
//  Flexibility     - Can easily switch from HTTP to HTTPS
//                  - Can run the same app on different ports or with different configurations
//                  - Can be used in serverless environments where you don't need a persistent server
//=========================================================================================

// Imports
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

// Express application
const app = express();

// TODO : Add a custom logging middleware here for packet traversal

// Middleware configuration // 

//-------------------------------------------------------------------------------------------
// CORS (Cross-Origin Resource Sharing) middleware configuration.
//
// This allows the backend API to accept requests from specified origins (frontends).
//
// Without CORS, a website could potentially:
// - Make requests to your bank's API from a malicious site
// - Access your private data from other domains
// - Perform actions on your behalf without permission
//
// When a cross-origin request is made, the browser:
// - Sends a preflight request (OPTIONS) to check if the request is allowed
// - Server responds with CORS headers indicating what's permitted
// - Browser either allows or blocks the actual request
//-------------------------------------------------------------------------------------------
app.use(cors());

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
app.use(helmet());


//-------------------------------------
// Health-check endpoint
//-------------------------------------
function healthCheckEndpoint(req: express.Request, res: express.Response) {
    res.status(200).json({ status: 'OK' });
}

app.get('/health', healthCheckEndpoint);

// Export the configured Express application
export default app;