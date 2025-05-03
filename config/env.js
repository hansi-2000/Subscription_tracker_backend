import { config } from "dotenv";

// project to .env file for environmental variables (can switch within production and development without overiding) 
config({path:`.env.${process.env.NODE_ENV || 'development'}.loacl`});

// coming from environmental variable file
export const {PORT, 
    NODE_ENV, 
    DB_URI, 
    JWT_SECRET, 
    JWT_EXPIRES_IN, 
    ARCJET_ENV, ARCJET_KEY,
    QSTASH_URL, QSTASH_TOKEN, QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY,
    EMAIL_PASSWORD} = process.env;