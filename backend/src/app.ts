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
import express from 'express';
import corsMiddleware from '@/middleware/cors.middleware';
import helmetMiddleware from '@/middleware/helmet.middleware';
import CreateRateLimitMiddleware from '@/middleware/rateLimit.middleware';
import errorMiddleware from '@/middleware/error.middleware';
import apiRouter from '@/routes/api.router';
import authRouter from '@/routes/auth.router';

// Express application
const app = express();

//-------------------------------------
// Middlewares
//-------------------------------------
// GLOBAL MIDDLEWARE : JSON Parser : Parse the request body as JSON
app.use(express.json());

// GLOBAL MIDDLEWARE : URL Encoded Parser : Parse the request body as URL Encoded (for forms)
app.use(express.urlencoded({ extended: true }));

// GLOBAL MIDDLEWARE : CORS : Pass the CORS Middleware function to the Express application
app.use(corsMiddleware);

// GLOBAL MIDDLEWARE : Helmet : Pass the Helmet Middleware function to the Express application
app.use(helmetMiddleware);

// GLOBAL MIDDLEWARE : Rate Limit : Create and Pass the Rate Limiter to the Express application
app.use(CreateRateLimitMiddleware());

//-------------------------------------
// Health-check endpoint
//-------------------------------------
// The placement of the health check endpoint is important
// It should be placed before the 404 error handler
function healthCheckEndpoint(req: express.Request, res: express.Response) {

    // Define the options for the health check endpoint
    const healthCheckOptions = {
        status: 'OK',
    }

    // Send the health check response
    res.status(200).json(healthCheckOptions);
}

// Pass the health check endpoint to the Express application
app.get('/health', healthCheckEndpoint);

//-------------------------------------
// Routers
//-------------------------------------
// API Router : 
app.use('/api', apiRouter);

// AUTH Router:
app.use('/auth', authRouter);

//-------------------------------------------------------------------------------------------
// 404 Error Handler
//
// This middleware handles requests to nERR 404 : on-existent routes.
//
// Without this, the application would return a 500 error for non-existent routes.
//-------------------------------------------------------------------------------------------
function notFoundHandler(req: express.Request, res: express.Response) {

    // Define the options for the 404 error handler 
    const notFoundOptions = {
        error: 'ERR 404 : Route not found',
    }

    console.log('404 Error Handler called');

    // Send the 404 error response
    res.status(404).json(notFoundOptions);
}
// Pass the 404 error handler to the Express application
// Express version <5 : The '*' wildcard is used to match all routes
// Express version >=5 : The '{*any}' wildcard is used to match all routes
// Valid routes won't call next(), thus ensuring that the 404 error handler is not called
app.use('/{*any}', notFoundHandler);

//-------------------------------------
// Error Handler Middleware
//-------------------------------------
// Pass the error handler middleware to the Express application
app.use(errorMiddleware);

// Export the configured Express application
export default app;