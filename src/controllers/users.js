import Users from "../models/user-models.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from "nanoid";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email'],
        });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

export const Register = async (req, res) => {
    const { name, email, password, confpassword } = req.body;
    if (password !== confpassword) {
        return res.status(400).json({
            msg: 'Password dan Konfirmasi Password Tidak Cocok',
        });
    }

    try {
        // Cek apakah email sudah ada dalam basis data
        const existingUser = await Users.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({
                msg: 'Email sudah terdaftar. Silakan gunakan email lain.'
            });
        }

        const salt = await bcryptjs.genSalt();
        const hashPassword = await bcryptjs.hash(password, salt);

        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
        });

        res.json({
            msg: 'Registrasi Berhasil',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (!user) return res.status(404).json({
            msg: 'Email tidak ditemukan',
        });

        const match = await bcryptjs.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({
            msg: "Password salah",
        });

        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const role = user.role;
        const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN, {
            expiresIn: '20s',
        });
        const refreshToken = jwt.sign({ userId, name, email, role }, process.env.REFRESH_TOKEN, {
            expiresIn: '1d',
        });

        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ msg: 'Refresh token tidak ada' });

    try {
        const user = await Users.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });

        const userId = user.id;
        await Users.update({ refresh_token: null }, {
            where: {
                id: userId
            }
        });

        res.clearCookie('refreshToken');
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
    }
};

