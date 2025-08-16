import dotenv from 'dotenv';

// Load the root .env file
dotenv.config();
// Print everything (this will be VERY long)
console.log('All env variables printed:', process.env);