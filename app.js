import express from 'express';
import db from './src/configs/database.js';
const app = express();
import router from './src/routes/routes.js';
import dotenv from 'dotenv';
dotenv.config();

try {
    await db.authenticate();
    console.log('Database Connected...');
} catch (error) {
    console.error(error);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(5000, () => console.log(`Server running at port 5000`));