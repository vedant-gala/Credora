//=========================================================================================
// File : server.ts
// Description : This file is the main entry point for the backend server.
//
// Purpose : 
// - Loads environment variables
// - Manages database and Redis connections
// - Starts the HTTP express server
// - Handles graceful shutdown, uncaught exceptions and unhandled rejections
// - Logs server startup status and connection information
//=========================================================================================

// Imports
import dotenv from 'dotenv';
import app from '@/app';
import { connectToDatabase } from '@/config/database';

// Load the root .env file
dotenv.config();
// Print everything (this will be VERY long)
console.log('All env variables printed:', process.env);



async function startServer() {
    try {
        const PORT = process.env['PORT'] || 3000;

        // Connect to the Database
        await connectToDatabase();
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();