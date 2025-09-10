//=========================================================================================
// File : auth.service.ts
//
// Purpose : 
//   Service Registration : Registers the authentication service
//   Service Implementation : Implements the authentication service
//=========================================================================================

// Imports
import { createUser, findUserByEmail } from '@/models/User';

//-------------------------------------
// Register
//-------------------------------------
export async function registerService(email: string, password: string) {
    try{
        // Check if the user already exists
        const isExistingUser = await findUserByEmail(email);

        if (isExistingUser) {
            return { success: false, error: 'User already exists' };
        }
        else{
            // Create a new user
            // TODO : Use hashed password instead of plain text
            const newUser = await createUser(email, password );
            return { success: true, message: 'User registered successfully' };
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
export async function loginService(email: string, password: string) {
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
export async function logoutService(email: string, password: string) {
    try{
        // TODO: Implement the logout service
        return { success: true, message: 'User logged out successfully' };
    }
    catch(error: any){
        console.error('Error logging out user:', error);
        return { success: false, error: 'Failed to log out user' };
    }
}

