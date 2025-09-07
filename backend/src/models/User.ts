//=========================================================================================
// File : User.ts
//
// Purpose : 
//   Model Registration : Registers the user model
//   Model Implementation : Implements the user model
//=========================================================================================

// Imports

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

