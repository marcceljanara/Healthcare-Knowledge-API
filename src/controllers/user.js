import Users from "../models/user-models.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) =>{
    try {
        const users = await Users.findAll();
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

export const Login = async (req,res) =>{
    try {
        const user = await Users.findAll({
            where : {
                email : req.body.email,
            }
        });
        const match = await bcryptjs.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({
           msg : "Wrong password", 
        });
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId,name,email},process.env.ACCESS_TOKEN,{
            expiresIn : '20s',
        });
        const refreshToken = jwt.sign({userId,name,email},process.env.REFRESH_TOKEN,{
            expiresIn : '1d',
        });
        await Users.update({refresh_token : refreshToken},{
            where :{
                id : userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly : true,
            maxAge : 24 * 60 * 60 * 1000
        })
        res.json({accessToken});
    } catch (error) {
        res.status(404).json({
            msg : 'Email tidak ditemukan',
        });
    }
}