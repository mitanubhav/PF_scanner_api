import { Request, Response } from 'express';
import { SpotModel } from '../models/spot.model';
import {TickerSearchDto,MatchedSearchDto} from '../dto/pricetickers.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
    Res,
    Authorized
} from "routing-controllers";

//@ApiTags('scanner')
@Controller('/api')
export class UserController {
    // Handle GET
    @Get('/') // 👈 Double-check that this (or @Post, @Put) is explicitly defined
  async getAll()  {
    return { error: 'retrieve records.' };
  }

  // @ApiOperation({ summary: 'Returns the list of purchased plans' })
 
    @Post('/spot/tickers')
    @Authorized()
     async getSpotTickers(@Body() body: TickerSearchDto) {
        try {
           //console.log('Received GET request with id:', body); // Debug log for received id
           const tickers = await SpotModel.getSpotTickers(body);
            return tickers;
            //return { Result: 'Retrieve records.' };
        } catch (error) {
            console.error(error);
            return { error: 'Failed to retrieve records.' };
        }
    }

    @Post('/future/tickers')
    @Authorized()
     async getFutureTickers(@Body() body: TickerSearchDto) {
        try {
           //console.log('Received GET request with id:', body); // Debug log for received id
           const tickers = await SpotModel.getFutureTickers(body);
            return tickers;
            //return { Result: 'Retrieve records.' };
        } catch (error) {
            console.error(error);
            return { error: 'Failed to retrieve records.' };
        }
    }

    @Post('/funding/tickers')
    @Authorized()
     async getFundingTickers(@Body() body: TickerSearchDto) {
        try {
           //console.log('Received GET request with id:', body); // Debug log for received id
           const tickers = await SpotModel.getFundingTickers(body);
            return tickers;
            //return { Result: 'Retrieve records.' };
        } catch (error) {
            console.error(error);
            return { error: 'Failed to retrieve records.' };
        }
    }

    @Post('/matched/tickers')
    @Authorized()
     async getMatchedTickers(@Body() body: MatchedSearchDto) {
        try {
           //console.log('Received GET request with id:', body); // Debug log for received id
           const tickers = await SpotModel.getMatched(body);
            return tickers;
            //return { Result: 'Retrieve records.' };
        } catch (error) {
            console.error(error);
            return { error: 'Failed to retrieve records.' };
        }
    }
    
    // Handle POST
    static async createUser(req: Request, res: Response): Promise<void> {
        const { firstName, lastName, email } = req.body;

        if (!firstName || !lastName || !email) {
            res.status(400).json({ error: 'Missing properties: firstName, lastName, or email.' });
            return;
        }

        try {
            const newUser = await SpotModel.create({ firstName, lastName, email });
            res.status(201).json({ message: 'User created.', user: newUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to insert record.' });
        }
    }

    // Handle PUT
    static async updateUser(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.body.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid ID structural parameter.' });
            return;
        }

        try {
            const isUpdated = await SpotModel.update(id, req.body);
            if (!isUpdated) {
                res.status(404).json({ error: 'User record not found.' });
                return;
            }
            res.status(200).json({ message: 'User record updated successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update record.' });
        }
    }
}
