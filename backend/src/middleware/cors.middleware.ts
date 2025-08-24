import express from 'express';
import cors from 'cors';

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
function corsMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {

    // Define the options for the CORS function
    const corsOptions = {
        // The origin is the URL of the frontend that is allowed to access the backend
        // In our case, it is the web-dashboard
        origin: 'http://localhost:3001',
        // The methods are the HTTP methods that are allowed to be used
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        // The allowed headers are the headers that are allowed to be used
        allowedHeaders: ['Content-Type', 'Authorization'],
    }

    // Call the cors function with the options supplied above
    const corsOutput = cors(corsOptions);

    console.log('CORS Middleware called');

    // The CORS function returns another function, so we call it with the request, response and next function
    corsOutput(req, res, next);
}

// Export the CORS middleware function
export default corsMiddleware;