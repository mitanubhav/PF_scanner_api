import { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Action } from 'routing-controllers';

export class AuthModule {
    private static readonly VALID_API_KEY = process.env.API_KEY || 'my-super-secret-key';
public static async authenticateApiKey(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    console.log('WebSocket server initialized. Awaiting secure connections...',req.query); // Debug log for incoming WebSocket connection attempts
    const apiKey = req.header('X-API-KEY') || req.query.api_key;

    // 1. Verify existence and match of the API Key
    if (!apiKey || apiKey !== AuthModule.VALID_API_KEY) {
      return false;
    }

    // 2. Optional: Check roles if specified on @Authorized(['admin'])
   /*  if (roles.length > 0) {
      const clientRole = action.request.headers['x-client-role'];
      return roles.includes(clientRole as string);
    } */

    return true;
  }
  public static authenticateHttApiKey = async (action: Action, roles: string[]): Promise<boolean> => {
    try {
    const apiKey = action.request.header('X-API-KEY') || action.request.query.api_key;
    //console.log('Received API Key:', apiKey); // Debug log for received API key
    const validApiKey = process.env.API_KEY;

    if (!apiKey || apiKey !== validApiKey) {
       console.log('API Key is invalid or missing.'); // Debug log for received API key
        return false;
    }
    return true;
  } catch (error) {
    console.error('Error during API key authentication:', error);
    return false;
  }
    
};

public static authenticateWsConnection = (req: http.IncomingMessage): boolean => {
    try {
        const urlParams = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
        const clientApiKey = urlParams.searchParams.get('api_key');
        return !!clientApiKey && clientApiKey === process.env.API_KEY;
    } catch {
        return false;
    }
};
}
