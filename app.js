import express from 'express';
import db from './src/configs/database.js';
const app = express();

try {
    await db.authenticate();
    console.log('Database Connected...');
} catch (error) {
    console.error(error);
}

app.listen(5000, () => console.log(`Server running at port 5000`));