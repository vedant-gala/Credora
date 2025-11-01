import express from 'express';
import jwt from 'jsonwebtoken';

//-------------------------------------------------------------------------------------------
// Auth Middleware
//
// This middleware is used to authenticate the user.
// It is used to authenticate the user and get the user's information
// It is used to protect routes that are only accessible to authenticated users
//
// Authentication middleware checks if a user is logged in before allowing access to protected routes
// It does this by :
//  - verifying that a valid JWT token is provided in the Authorization header of the request
//  - Extracting user information from the token for use in subsequent middleware or route handlers
//-------------------------------------------------------------------------------------------

// Extend the request interface to include the user property
export interface AuthRequest extends Request {
    user : any; // This is the user information that is decoded from the JWT token
}

function authMiddleWare (req: AuthRequest, res: express.Response, next: express.NextFunction) {
    // Extract the request ID from headers
    const requestId = req.headers.get('x-request-id');
    console.log('AUTH MIDDLEWARE : Starting authentication check');

    try{
        // Extract the token from the Authorization header
        const authHeader = req.headers.get('Authorization');
        
        if (authHeader) {
            // remove the 'Bearer ' prefix from the header to arrive at the Token
            const token = authHeader.replace('Bearer ', '');
            console.log(`AUTH MIDDLEWARE : Token : ${token}`);

            // Fetch the secret from the environment variables
            const secret = process.env['JWT_SECRET'];
            if (!secret){
                console.error('AUTH MIDDLEWARE : JWT_SECRET environment variable not set');
                return res.status(500).json({ error: 'Internal server error: JWT secret not configured' });
            }

            // Verify the JWT token using the secret from environment variables
            // If verification fails, this will throw an error that will be caught below
            // TODO: Replace "as any" with a dedicated interface JwtPayload that will be deterministic in its structure
            const decoded = jwt.verify(token, secret) as any;

            // Store the decoded user information in the request object for use by other middlewares
            req.user = decoded;

            // Extract user ID and email from the decoded token for logging purporse
            const userId    = decoded.userId;
            const userEmail = decoded.email;
            console.log(`AUTH MIDDLEWARE : Authentication successful for User ID : ${userId}, User Email : ${userEmail}`);

            // Call the next middleware function in the chain]
            return next();
        }
        else{
            console.log('AUTH MIDDLEWARE : No token provided');
            return res.status(401).json({ error: 'Access denied. No token provided' });
        }
    }
    catch {

    }    
}
