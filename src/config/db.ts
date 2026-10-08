import * as sql from "mssql";
//import { connect, query, Request } from 'mssql'; 
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export function getDatabaseConnection(): Promise<sql.ConnectionPool> {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(dbConfig)
            .connect()
            .then(pool => {
                console.log('Connected to MS SQL Server.');
                return pool;
            })
            .catch(err => {
                poolPromise = null;
                console.error('Database Connection Failed: ', err);
                throw err;
            });
    }
    return poolPromise;
}
