/* eslint-disable import/extensions */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './src/configs/database.js';
import router from './src/routes/routes.js';
import Medicines from './src/models/medicine-models.js';
import Users from './src/models/user-models.js';

dotenv.config();

const app = express();
const initializeDatabase = async () => {
  try {
    await db.authenticate();
    console.log('Database Connected...');
    await Users.sync();
    await Medicines.sync();
  } catch (error) {
    console.error(error);
  }
};

// Memanggil fungsi inisialisasi database
initializeDatabase();

app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use(router);

app.listen(5000, () => console.log('Server running at port 5000'));
