import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { Request, Response } from 'express';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, next: (err: any) => any) {
    console.log(error.message,error.name); 
    // Debug log for error details
    // Check if the error is an UnauthorizedError (status 401)
    if (error.name === 'UnauthorizedError') {
        response.status(403).json({
        message: "You do not have permission to access this resource.",
        // Optionally pass the original error details if needed in development
      });
    } else {
      // Pass other errors (like 500 server errors) to the default handler
      response.status(error.httpCode || 500).json({
        message: error.message || "An unexpected error occurred."
      });
    }
    
    next(error);
  }
}