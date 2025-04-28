import { Router } from "express";
import { signIn, signUp, signOut } from "../controllers/auth.controller.js";

const authRouter = Router();

// path: /api/v1/auth/sign-up (POST) --> pass values as {name, email, password} ---> created new user 
authRouter.post('/sign-up', signUp);
// path: /api/v1/auth/sign-in (POST) --> pass values as {email, password} ---> user signed in successfully   
authRouter.post('/sign-in', signIn); 
authRouter.post('/sign-out', signOut); 

export default authRouter;