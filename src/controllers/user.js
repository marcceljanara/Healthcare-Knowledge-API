import Users from "../models/user-models.js";
import bcryptjs from 'bcryptjs';

export const getUsers = async (req, res) =>{
    try {
        const users = Users.findAll();
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async (req,res) =>{
    const {name, email, password, confpassword} = req.body;
    if(password !== confpassword) return res.status(400).json({
        msg : 'Password dan Konfirmasi Password Tidak Cocok',
    });
    const salt =await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, salt);
    console.log(hashPassword);
    try {
        await Users.create({
            name : name,
            email : email,
            password : hashPassword,
        });
        res.json({
            msg : 'Registrasi Berhasil',
        })
    } catch (error) {
        console.log(error);
    }
}