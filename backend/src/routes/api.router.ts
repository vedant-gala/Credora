import { Request, Response, NextFunction } from 'express';
import Router from 'express';

//=========================================================================================
// File : api.router.ts
// Description : This file contains the API routes for the backend server.
//
// Purpose : 
//   Route Registration : Mounts API routes
//   Route Logging      : Logs the route being dispatched to
//=========================================================================================

const apiRouter = Router();
//-------------------------------------
// Route Logger
//-------------------------------------
function routeLogger(req: Request, res: Response, next: NextFunction) {
    console.log(`ROUTE DISPATCHER : Dispatching to ${req.method} ${req.url}`);
    next();
}
apiRouter.use(routeLogger);

//-------------------------------------
// Sub-Routers
//-------------------------------------



export default apiRouter;