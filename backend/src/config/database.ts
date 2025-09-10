//=========================================================================================
// File : database.ts
//
// Purpose : 
//   Database Configuration : Configures the database
//=========================================================================================

// Imports
import { Pool, PoolConfig, Result } from 'pg';
import dotenv from 'dotenv';

// Load the environment variables
dotenv.config();

//-------------------------------------
// Database Configuration
//-------------------------------------
// Note : The exclamation mark is used to tell TypeScript that the environment variable is not null
const poolOptions: PoolConfig = {
    max: 20,                                    // Maximum number of connections in the pool
    min: 2,                                     // Minimum number of connections in the pool
    idleTimeoutMillis: 30000,                   // Time after which an idle connection is closed
    connectionTimeoutMillis: 2000,              // Time after which a connection attempt is timed out
    allowExitOnIdle: true,                      // Allow the pool to exit when all connections are idle
    user: process.env['DB_USER']!,              // Username for the database
    host: process.env['DB_HOST']!,              // Host for the database
    database: process.env['DB_NAME']!,          // Database name
    password: process.env['DB_PASSWORD']!,      // Password for the database
    port: parseInt(process.env['DB_PORT']!)     // Port for the database
};

const pool = new Pool(poolOptions);

export async function connectToDatabase() {
    try {
        console.log('Connecting to database...');

        // Note : The connect method is used to connect to the database
        // It returns a promise that resolves when the connection is established
        const client = await pool.connect();

        // If the connection is successful, the connection is logged
        console.log('Connected to database');

        // Release the connection back to the pool
        // This needs to be done manually since we used pool.connect() earlier
        client.release();
    } catch (error) {
        // If the connection fails, an error is thrown
        // The error is thrown to the caller
        // The caller can handle the error or rethrow it
        // The caller can also log the error to a file or a database
        // The caller can also send an email to the admin
        // The caller can also display a message to the user
        console.error('Error connecting to database:', error);
        throw error;
    }
}

export async function query (text: string, params? : any[] ) : Promise<Result> {
    // Note : The query method is used to query the database, it returns a promise<pg.Result>
    try {
        const result = await pool.query(text, params);
        return result;
    }
    catch (error: any) {
        console.error('Error querying database:', error);
        throw error;
    }
}

// Export the pool
export default pool;