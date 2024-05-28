import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/users.js";
import { authorizeMedicineActions, verifyToken } from "../middleware/verify-token.js";
import { refreshToken } from "../controllers/refresh-token.js";
import { createMedicine, deleteMedicineById, getDetailMedicineById, getMedicines, getMedicinesDoctor, updateMedicine } from "../controllers/medicines.js";


const router = express.Router();

// Register, Login & Logout route
router.get('/users',verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

// CRUD medicines route
router.post('/medicines',verifyToken, createMedicine);
router.get('/medicinesdoctor',verifyToken, getMedicinesDoctor);
router.put('/medicines/:id', verifyToken,authorizeMedicineActions, updateMedicine);
router.delete('/medicines/:id',verifyToken,authorizeMedicineActions, deleteMedicineById);

// CRUD Multi User
router.get('/medicines',getMedicines);
router.get('/medicines/:id', getDetailMedicineById);

export default router;