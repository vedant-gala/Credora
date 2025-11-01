//=========================================================================================
// File : database.ts
//
// Purpose : 
//   Database Configuration : Configures the database
//=========================================================================================

// Imports
import { Pool, PoolConfig, Result } from 'pg';
import dotenv from 'dotenv';
import {join } from 'path';
import { readFileSync } from 'fs';

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

        // Initialize the database schema after successful connection
        await initializeDatabase();
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

async function isDatabaseInitialized(): Promise <boolean> {
    try {
        // Check if the users table exists or not
        const result = await query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users')")

        if (!result.rows[0]?.exists) {
            console.log('Users table does not exist, Database is not initialized')
            return false;
        }

        console.log('Database is already initialized');
        return true;
    }
    catch (error) {
        console.log('Database not initialized');
        return false;
    }
}

export async function initializeDatabase() : Promise <void> {
    try {
        const isInitialized = await isDatabaseInitialized();

        if (isInitialized) {
            return;
        }
        else {
            console.log('Since Database is not already initialized, proceeding to initialize database');
        }

        // Get the path to the schema file
        const schemaPath = join(__dirname, 'schema.sql');
        // Read the schema file
        const schemaSQL  = readFileSync(schemaPath, 'utf8');

        // Execute the schema
        await query(schemaSQL);
        console.log('Database initialized successfully');

    }
    catch (error) {
        console.error('Error initializing database');
        throw error;
    }
}

// Export the pool
export default pool;