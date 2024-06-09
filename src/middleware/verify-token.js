/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import Users from '../models/user-models.js';
import Medicines from '../models/medicine-models.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Token tidak ditemukan' });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.userId = decoded.userId;

    // Ambil role pengguna dari basis data
    const user = await Users.findByPk(req.userId);
    req.userRole = user.role;

    return next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ msg: 'Token tidak valid' });
  }
};

export const authorizeMedicineActions = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Mengambil data obat berdasarkan ID
    const medicine = await Medicines.findByPk(id);

    // Jika data obat tidak ditemukan, kembalikan status 404
    if (!medicine) {
      return res.status(404).json({
        msg: 'Data obat tidak ditemukan',
      });
    }

    // Jika pengguna adalah admin, izinkan akses
    if (req.userRole === 'admin') {
      return next();
    }

    // Jika pengguna bukan admin, periksa apakah user_id sesuai
    if (medicine.user_id !== req.userId) {
      return res.status(403).json({
        msg: 'Anda tidak memiliki izin untuk melakukan aksi ini',
      });
    }

    // Izinkan akses jika user_id sesuai
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Terjadi kesalahan saat memverifikasi izin',
    });
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.userId;
    req.role = user.role;
    next();
  });
};
