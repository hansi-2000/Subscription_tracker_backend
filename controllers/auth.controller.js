import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from "../model/user.model";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env";

export const sighUp = async (req,res, next) => {
    const session = await mongoose.startSession();

    try {
        // create a new user 

        const { name, email, password} = req.body;

        // check if the user already exist
        const existingUser = await User .findOne({email});

        if(existingUser) {
            const error = new Error('User already exist');
            error.StatusCode = 409;
            throw error;
        }

        // if user does not exist, we hash the PW
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await user.create([{name, email, password: hashedPassword}], {session});

        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            date: {
                token,
                user: newUsers[0], 
            }
        })

    } catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const sighIn = async (req,res, next) => {}

export const sighOut = async (req,res, next) => {}