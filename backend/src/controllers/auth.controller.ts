//=========================================================================================
// File : auth.controller.ts
// Description : This file contains the authentication controller for the backend server.
//
// Purpose : 
//   Controller Registration : Registers the authentication controller
//=========================================================================================

// Imports
import type { Request, Response } from 'express';
import { registerService} from '@/services/auth.service';

//-------------------------------------
// Register
//-------------------------------------
export async function register(req: Request, res: Response) {
    try{
        console.log('Registering user...');
        console.log(req.body);
        const { username, email, password } = req.body;

        // Validate the request body
        // If any of the fields are missing, return a 400 error
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Invoke the register service
        const result = await registerService(username, email, password);

        if(result.success){
            // Return a success response
            return res.status(201).json({ message: 'User registered successfully' });
        }
        else{
            // Return a error response
            return res.status(400).json({ error: result.error });
        }
    }
    catch(error: any){
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Failed to register user' });
    }
}

//-------------------------------------
// Login
//-------------------------------------
export function login(req: Request, res: Response) {
    res.send('Login');
}

//-------------------------------------
// Logout
//-------------------------------------
export function logout(req: Request, res: Response) {
    res.send('Logout');
}

//-------------------------------------
// Refresh
//-------------------------------------
export function refresh(req: Request, res: Response) {
    res.send('Refresh');
}

//-------------------------------------
// Verify
//-------------------------------------
export function verify(req: Request, res: Response) {
    res.send('Verify');
}