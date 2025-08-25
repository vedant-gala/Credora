//=========================================================================================
// File : auth.router.ts
// Description : This file contains the authentication routes for the backend server.
//
// Purpose : 
//   Route Registration : Mounts authentication routes
//   Route Logging      : Logs the route being dispatched to
//=========================================================================================

// Imports
import { Request, Response, NextFunction } from 'express';
import Router from 'express';
import { login, logout, refresh, register, verify } from '@/controllers/auth.controller';

const authRouter = Router();

//-------------------------------------
// Route Logger
//-------------------------------------
function routeLogger(req: Request, res: Response, next: NextFunction) {
    console.log(`AUTH ROUTER: Processing ${req.method} ${req.url}`);
    next();
}
authRouter.use(routeLogger);

//-------------------------------------
// Routes
//-------------------------------------

// REGISTER : Register a new user
authRouter.post('/register', register);

// LOGIN : Login a user
authRouter.post('/login', login);

// LOGOUT : Logout a user
authRouter.post('/logout', logout);

// REFRESH : Refresh a user's token
authRouter.post('/refresh', refresh);

// VERIFY : Verify a user's token
authRouter.post('/verify', verify);

// Exports
export default authRouter;