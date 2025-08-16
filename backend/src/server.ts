import dotenv from 'dotenv';
import app from '@/app';

// Load the root .env file
dotenv.config();
// Print everything (this will be VERY long)
console.log('All env variables printed:', process.env);

async function startServer() {
    try {
        const PORT = process.env['PORT'] || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();