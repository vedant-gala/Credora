//=========================================================================================
// File : User.ts
// Contains APIs to abstract away the SQL queries for the "users" table defined in the Schema
//
// APIs :
// findUserByEmail : Finds a user by their email
// createUser : Creates a new user
// updateUser : Updates a user
// deleteUser : Deletes a user
//=========================================================================================

// Imports
import { query } from '@/config/database';

//-------------------------------------
// User Model
//-------------------------------------

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

// findByEmail
export async function findUserByEmail (email: string) : Promise <any> {
    try {
        const result = await query(
            `SELECT * FROM users WHERE email = $1`, 
            [email]
        );
        return result.rows[0];
    }
    catch (error: any) {
        console.error('Error finding user by email:', error);
        throw error;
    }
}

// Create User
export async function createUser (email : string, password: string) : Promise <any> {
    try {
        const result = await query(
            `INSERT INTO users (email, password) VALUES ($1, $2)`,
            [email, password]
        );
        return result.rows[0];
    }
    catch (error: any) {
        console.error('Error creating user:', error);
        throw error;
    }
}

// Update User
export async function updateUserByEmail (email: string, password: string) : Promise <any> {
    try {
        const result = await query(
            `UPDATE users SET email = $1, password = $2`,
            [email, password]
        );
        return result.rows[0];
    }
    catch (error: any) {
        console.error('Error updating user:', error);
        throw error;
    }
}

// Delete User
export async function deleteUserByEmail (email: string) : Promise <any> {
    try {
        const result = await query(
            `DELETE FROM users WHERE email = $1`,
            [email]
        );
        return result.rows[0];
    }
    catch (error: any) {
        console.error('Error deleting user:', error);
        throw error;
    }
}