import jwt from 'jsonwebtoken';
import Users from '../models/user-models.js';

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ msg: 'Token tidak ditemukan' });

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.userId = decoded.userId;

        // Ambil role pengguna dari basis data
        const user = await Users.findByPk(req.userId);
        req.userRole = user.role;

        next();
    } catch (error) {
        console.error(error);
        res.status(403).json({ msg: 'Token tidak valid' });
    }
};

export const authorizeUser = (req, res, next) => {
    if (req.userRole === 'admin') {
        // Jika pengguna adalah admin, mereka memiliki akses ke semua data obat
        next();
    } else {
        // Jika bukan admin, periksa apakah user_id di data obat cocok dengan user_id dari token
        if (req.params.id === req.userId) {
            next();
        } else {
            res.status(403).json({
                msg: "Tidak diizinkan mengakses data obat ini"
            });
        }
    }
};

