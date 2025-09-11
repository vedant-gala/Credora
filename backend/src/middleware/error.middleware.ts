import express from 'express';
//-------------------------------------------------------------------------------------------
// Error Middleware
//
// This middleware handles errors that occur in the application.
//
// Without Error Middleware, the application would:
// - Return a 500 error for all errors
// - Not provide a meaningful error message
// - Not log the error
// - Not send a response to the client
//
// Benefits : 
// - Provides a meaningful error message to the client
// - Logs the error
// - Sends a response to the client
// - Provides a stack trace for debugging
// - Does not expose sensitive information to the client
//-------------------------------------------------------------------------------------------
function errorMiddleware(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log('Error Middleware called');
    console.log('Error : ', err);
    console.log('Modifying the error to be "Internal server error"');

    // Don't leak sensitive information to the client
    const modifiedError = 'Internal Server Error';

    // Send the error response
    res.status(500).json({ error: modifiedError });
}

// Export the Error middleware function
export default errorMiddleware;