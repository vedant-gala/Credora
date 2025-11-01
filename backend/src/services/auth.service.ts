//=========================================================================================
// File : auth.service.ts
//
// Purpose : 
//   Service Registration : Registers the authentication service
//   Service Implementation : Implements the authentication service
//=========================================================================================

// Imports
import { createUser, findUserByEmail } from '@/models/User';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

//-------------------------------------
// Register
//-------------------------------------
export async function register(email: string, password: string) {
    try{
        // Check if the user already exists
        console.log('Checking if user already exists')
        const isExistingUser = await findUserByEmail(email);

        if (isExistingUser) {
            console.log('User already exists, sending error')
            return { success: false, error: 'User already exists' };
        }
        else{
            console.log('User does not exist, proceeding to register a new user');

            // Hash the password
            const saltRounds = parseInt(process.env['BCRYPT_ROUNDS']!);
            const hashedPassword  = await bcrypt.hash(password, saltRounds);

            // Create a new user
            const newUser = await createUser(email, hashedPassword );

            // Generate tokens for improved UX, and so that user is auto-logged in after registration
            // and directed to dashboard. Without this, user would have to separately login after registration
            const accessToken  = generateAccessToken(newUser.id);
            const refreshToken = generateRefreshToken(newUser.id);

            return { 
                success: true, 
                message: 'User registered successfully',
                accessToken,
                refreshToken };
        }
    }
    catch(error: any){
        console.error('Error registering user:', error);
        return { success: false, error: 'Failed to register user' };
    }
}

//-------------------------------------
// Login
//-------------------------------------
export async function login(email: string, password: string) {
    try{
        // Check if the user exists
        const isExistingUser = await findUserByEmail(email);

        // Check if the user exists
        if (!isExistingUser) {
            return { success: false, error: 'User does not exist' };
        }

        // Verify the password
        // TODO : Verify against hashed password instead of plain text
        if (isExistingUser.password !== password) {
            return { success: false, error: 'Invalid password' };
        }
        else {
            return { success: true, message: 'User logged in successfully' };
        }
    }
    catch(error: any){
        console.error('Error logging in user:', error);
        return { success: false, error: 'Failed to log in user' };
    }
}

//-------------------------------------
// Logout
//-------------------------------------
export async function logout(email: string, password: string) {
    try{
        // TODO: Implement the logout service
        return { success: true, message: 'User logged out successfully' };
    }
    catch(error: any){
        console.error('Error logging out user:', error);
        return { success: false, error: 'Failed to log out user' };
    }
}

export const authService = {
    register,
    login,
    logout
}


//-------------------------------------
// GenerateAccessToken
//-------------------------------------
function generateAccessToken(userId: string) : string {

    const SignOpts = {expiresIn: process.env['JWT_EXPIRES_IN']!};

    return jwt.sign(
        { userId },
        process.env['JWT_SECRET']!,
        SignOpts as SignOptions
    );    
}

//-------------------------------------
// GenerateRefreshToken
//-------------------------------------
function generateRefreshToken(userId: string) : string {

    const SignOpts = {expiresIn: process.env['JWT_REFRESH_EXPIRES_IN']!};

    return jwt.sign(
        { userId },
        process.env['JWT_REFRESH_SECRET']!,
        SignOpts as SignOptions
    );    
}