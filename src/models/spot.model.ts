import sql from 'mssql';
import { getDatabaseConnection } from '../config/db';
import {TickerSearchDto,MatchedSearchDto} from '../dto/pricetickers.dto';

export interface IUser {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
}

export class SpotModel {
    // SELECT Query Logic
    static async getSpotTickers(search: TickerSearchDto): Promise<IUser[]> {
        const pool = await getDatabaseConnection();
        const request = pool.request();
        let pageLimit = search.page_limit || 10; // Default to 10 if not provided
        if (pageLimit <= 0) pageLimit = 10; // Ensure a minimum value
        if (pageLimit > 400) pageLimit = 400; // Cap at 400 to prevent excessive load
        let query = 'select top '+ pageLimit +' * from spot_rate';

        if (search.exchange !== 'All') {
            request.input('exchangeId', sql.VarChar(50), search.exchange);
            query += ' WHERE exchangeId = @exchangeId';
        } 
        if (search.symbol !== 'All') {
            request.input('symbolId', sql.VarChar(50), `${search.symbol}%`);
            query += ' and symbol like @symbolId'
        } 
        //console.log('Constructed SQL Query:', query); // Debug log for constructed query
        const result = await request.query(query);
        return result.recordset;
    }

    // Get Future Tickers
    static async getFutureTickers(search: TickerSearchDto): Promise<IUser[]> {
        const pool = await getDatabaseConnection();
        const request = pool.request();
        let pageLimit = search.page_limit || 10; // Default to 10 if not provided
        if (pageLimit <= 0) pageLimit = 10; // Ensure a minimum value
        if (pageLimit > 400) pageLimit = 400; // Cap at 400 to prevent excessive load
        let query = 'select top '+ pageLimit +' * from future_rate';

        if (search.exchange !== 'All') {
            request.input('exchangeId', sql.VarChar(50), search.exchange);
            query += ' WHERE exchangeId = @exchangeId';
        } 
        if (search.symbol !== 'All') {
            request.input('symbolId', sql.VarChar(50), `${search.symbol}%`);
            query += ' and symbol like @symbolId'
        } 
        //console.log('Constructed SQL Query:', query); // Debug log for constructed query
        const result = await request.query(query);
        return result.recordset;
    }

    // Get Funding Tickers
    static async getFundingTickers(search: TickerSearchDto): Promise<IUser[]> {
        const pool = await getDatabaseConnection();
        const request = pool.request();
        let pageLimit = search.page_limit || 10; // Default to 10 if not provided
        if (pageLimit <= 0) pageLimit = 10; // Ensure a minimum value
        if (pageLimit > 400) pageLimit = 400; // Cap at 400 to prevent excessive load
        let query = 'select top '+ pageLimit +' * from funding_rate';

        if (search.exchange !== 'All') {
            request.input('exchangeId', sql.VarChar(50), search.exchange);
            query += ' WHERE exchangeId = @exchangeId';
        } 
        if (search.symbol !== 'All') {
            request.input('symbolId', sql.VarChar(50), `${search.symbol}%`);
            query += ' and symbol like @symbolId'
        } 
        //console.log('Constructed SQL Query:', query); // Debug log for constructed query
        const result = await request.query(query);
        return result.recordset;
    }

    // Get Matched Records (Generic)
    static async getMatched(search: MatchedSearchDto): Promise<IUser[]> {
        const pool = await getDatabaseConnection();
        const request = pool.request();
         request.input('buyexchange', sql.VarChar(50), search.buy_exchange);
         request.input('sellexchange', sql.VarChar(50), search.sell_exchange);
            request.input('symbol', sql.VarChar(50), `${search.symbol}%`);
            request.input('category', sql.VarChar(50), search.category);
            request.input('order_type', sql.VarChar(50), search.order_type);
            request.input('plan_no', sql.Int, search.plan_no);
        let query = 'select * from matched_records WHERE buy_exchangeId = @buy_exchangeId and sell_exchangeId = @sell_exchangeId and symbol like @symbolId and category = @category and order_type = @order_type and plan_no = @plan_no';
        //console.log('Constructed SQL Query:', query); // Debug log for constructed query
        const result = await request.execute('[dbo].[sp_scanner_opportunity]');
        return result.recordset;
      // return [];
    }

    // INSERT Query Logic
    static async create(user: IUser): Promise<IUser> {
        const pool = await getDatabaseConnection();
        const result = await pool.request()
            .input('firstName', sql.NVarChar(50), user.firstName)
            .input('lastName', sql.NVarChar(50), user.lastName)
            .input('email', sql.NVarChar(100), user.email)
            .query(`
                INSERT INTO Users (first_name, last_name, email) 
                OUTPUT inserted.id, inserted.first_name as firstName, inserted.last_name as lastName, inserted.email
                VALUES (@firstName, @lastName, @email)
            `);
        return result.recordset[0];
    }

    // UPDATE Query Logic
    static async update(id: number, user: Partial<IUser>): Promise<boolean> {
        const pool = await getDatabaseConnection();
        const result = await pool.request()
            .input('userId', sql.Int, id)
            .input('firstName', sql.NVarChar(50), user.firstName || null)
            .input('lastName', sql.NVarChar(50), user.lastName || null)
            .input('email', sql.NVarChar(100), user.email || null)
            .query(`
                UPDATE Users 
                SET 
                    first_name = COALESCE(@firstName, first_name),
                    last_name = COALESCE(@lastName, last_name),
                    email = COALESCE(@email, email)
                WHERE id = @userId;
                
                SELECT @@ROWCOUNT as rowsUpdated;
            `);

        const rowsUpdated = result.recordset[0].rowsUpdated;
        return rowsUpdated > 0;
    }
}
