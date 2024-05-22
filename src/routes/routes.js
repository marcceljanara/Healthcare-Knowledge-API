import express from "express";
import { getUsers, Register, Login } from "../controllers/user.js";
import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();

router.get('/users',verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);

export default router;