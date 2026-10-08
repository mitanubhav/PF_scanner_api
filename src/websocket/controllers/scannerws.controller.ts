import { WebSocket } from 'ws';
import { SpotModel } from '../../models/spot.model';
import {TickerSearchDto,MatchedSearchDto} from '../../dto/pricetickers.dto';

export class ScannerController {
    // Handle Spot Tickers
    static async getSpotTickers(ws: WebSocket, payload: TickerSearchDto): Promise<void> {
        try {
            //const id = payload?.id ? parseInt(payload.id) : undefined;
            console.log('Received SELECT action with payload:', payload);
            const users = await SpotModel.getSpotTickers(payload);
            ws.send(JSON.stringify({ event: 'SPOT_SUCCESS', data: users }));
        } catch (error) {
            ws.send(JSON.stringify({ event: 'SPOT_FAILED', error: 'Failed to retrieve database records.' }));
        }
    }

    // Handle Future Tickers
    static async getFutureTickers(ws: WebSocket, payload: TickerSearchDto): Promise<void> {
        try {
            //const id = payload?.id ? parseInt(payload.id) : undefined;
            console.log('Received SELECT action with payload:', payload);
            const users = await SpotModel.getFutureTickers(payload);
            ws.send(JSON.stringify({ event: 'FUTURE_SUCCESS', data: users }));
        } catch (error) {
            ws.send(JSON.stringify({ event: 'FUTURE_FAILED', error: 'Failed to retrieve database records.' }));
        }
    }

    // Handle Funding Tickers
    static async getFundingTickers(ws: WebSocket, payload: TickerSearchDto): Promise<void> {
        try {
            //const id = payload?.id ? parseInt(payload.id) : undefined;
            console.log('Received SELECT action with payload:', payload);
            const users = await SpotModel.getFundingTickers(payload);
            ws.send(JSON.stringify({ event: 'FUNDING_SUCCESS', data: users }));
        } catch (error) {
            ws.send(JSON.stringify({ event: 'FUNDING_FAILED', error: 'Failed to retrieve database records.' }));
        }
    }

    // Handle Matched Tickers
    static async getMatchedTickers(ws: WebSocket, payload: MatchedSearchDto): Promise<void> {
        try {
            //const id = payload?.id ? parseInt(payload.id) : undefined;
            console.log('Received SELECT action with payload:', payload);
            const users = await SpotModel.getMatched(payload);
            ws.send(JSON.stringify({ event: 'MATCHED_SUCCESS', data: users }));
        } catch (error) {
            ws.send(JSON.stringify({ event: 'MATCHED_FAILED', error: 'Failed to retrieve database records.' }));
        }
    }
}
