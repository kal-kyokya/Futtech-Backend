import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


// Enable access to the '.env' file
dotenv.config();

// Extract environment variables found in '.env'
const PORT = process.env.EXPRESS_PORT;
const URL = process.env.MONGO_URL;

const app = express();

mongoose
    .connect( URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
    })
    .then(() => console.log('DB Connection - Success'))
    .catch((err) => console.log(err));

app.listen(PORT , () => {
    console.log('The server is running on port: 8080');
});
