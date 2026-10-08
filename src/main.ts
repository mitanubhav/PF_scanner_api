import 'dotenv/config';
 import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './middleware/auth';
import { CustomErrorHandler } from './middleware/globalError';
import { AppModule } from './app.module';
import userRoutes from './routes/user.routes';
import { ScannerController } from './websocket/controllers/scannerws.controller';
import { WebSocketServer, WebSocket } from 'ws';
import http, { request } from 'http';
import 'reflect-metadata'; // Mandatory for decorator metadata parsing
import { useExpressServer ,createExpressServer,Action } from 'routing-controllers';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();
//const app = await NestFactory.create<NestExpressApplication>(AppModule);
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

 const VALID_API_KEY = process.env.API_KEY || 'default_api_key';
 /* const app = createExpressServer({
  cors: false,
  controllers: AppModule.controllers ,// Register all your controllers here
  authorizationChecker: AuthModule.authenticateApiKey,
  
});  */ 
try{
useExpressServer(app, {
  cors: true,
  controllers: AppModule.controllers,
  authorizationChecker: AuthModule.authenticateHttApiKey,
  middlewares: [CustomErrorHandler], // Register your error middleware
    defaultErrorHandler: false     
});
} catch (error) {
  console.error('Error setting up Express server with routing-controllers:', error);
  process.exit(1);
}
app.get('/api/data', (req: Request, res: Response) => {
  res.status(200).json({ message: "Success!" });
});
// Apply global API security middleware [0.34]
//app.use(authenticateApiKey);

// Register user feature routes [0.20]
//app.use('/api/users',authenticateApiKey, userRoutes);

 const server = http.createServer(app);

const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket Protocol Upgrades Securely
server.on('upgrade', (request, socket, head) => {
    const isAuthorized = AuthModule.authenticateWsConnection(request);

    if (!isAuthorized) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// WebSocket Connection Events & Client Router
wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected securely via WebSocket.');

    ws.on('message', async (messageData: string) => {
        try {
            const parsedMessage = JSON.parse(messageData);
            const { action, payload } = parsedMessage;
            console.log(`Received WebSocket message with action: ${action} and payload:`, payload);
            switch (action) {
                case 'spot':
                    await ScannerController.getSpotTickers(ws, payload);
                    break;
                case 'future':
                    await ScannerController.getFutureTickers(ws, payload);
                    break;
                case 'funding':
                    await ScannerController.getFundingTickers(ws, payload);
                    break;
                case 'matched':
                    await ScannerController.getMatchedTickers(ws, payload);
                    break;
                default:
                    ws.send(JSON.stringify({ event: 'error', error: `Unknown action: ${action}` }));
            }
        } catch (err) {
            ws.send(JSON.stringify({ event: 'error', error: 'Malformed JSON payload.' }));
        }
    });
});
 
const PORT = process.env.PORT || 3000;
 server.listen(PORT, () => {
    console.log(`Dual Server running at http://localhost:${PORT} and ws://localhost:${PORT}`);
}); 
/* app.listen(PORT, () => {
    console.log(`Secured MVC API running at http://localhost:${PORT}`);
});  */


