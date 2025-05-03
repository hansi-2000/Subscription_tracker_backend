import express from "express";
import cookieParser from "cookie-parser";
import {PORT} from './config/env.js';
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";


const app = express()

// middleware that provide default by express 
app.use(express.json());  // handle json data sent in request/ API calls
app.use(express.urlencoded({extended:false})); // hsndle form data comes via html forms
app.use(cookieParser());
app.use(arcjetMiddleware);

// this would direct to api/v1/auth/sign-up
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

// we can create routes we need using http methods
// path where reachable, callback function (req,res) => {code}
app.get("/", (req,res) => {
    res.send('Welcome to the subscription tracker')
});

// route creation is not enough. we have to makeserver listen for requests of routes 
// app.listen(port, callback function)
app.listen(PORT, async() => {
    console.log(`Subscription tracker is running on http://localhost:${PORT}`);

    await connectToDatabase();
});

export default app;
