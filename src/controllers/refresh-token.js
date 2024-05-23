import Users from "../models/user-models.js";
import jwt from 'jsonwebtoken';

export const refreshToken = async (req,res) => {
    try {
        const refreshToken = await req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where : {
                refresh_token : refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) =>{
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const name = user[0].id;
            const email = user[0].id;
            const accessToken = jwt.sign({userId, name, email},process.env.ACCESS_TOKEN,{
                expiresIn : '15s'
            });
            res.json({accessToken})
        });
    } catch (error) {
        console.log(error);
    }
}