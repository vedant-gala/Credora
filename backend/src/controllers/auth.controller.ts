//=========================================================================================
// File : auth.controller.ts
// Description : This file contains the authentication controller for the backend server.
//
// Purpose : 
//   Controller Registration : Registers the authentication controller
//=========================================================================================

// Imports
import type { Request, Response } from 'express';

//-------------------------------------
// Register
//-------------------------------------
export function register(req: Request, res: Response) {
    res.send('Register');
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