import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './src/configs/database.js';
import router from './src/routes/routes.js';
dotenv.config();

const app = express();
try {
    await db.authenticate();
    console.log('Database Connected...');
} catch (error) {
    console.error(error);
}
app.set('view engine','ejs');
app.use(cors({credentials : true, origin : 'http://localhost:3000'}))
app.use(cookieParser());
app.use(express.json());

app.use(router);

app.listen(5000, () => console.log(`Server running at port 5000`));