import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/users.js";
import { verifyToken } from "../middleware/verify-token.js";
import { refreshToken } from "../controllers/refresh-token.js";
import { createMedicine } from "../controllers/medicines.js";


const router = express.Router();

// Register, Login & Logout route
router.get('/users',verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

// CRUD medicines route
router.post('/medicines',verifyToken, createMedicine)

export default router;