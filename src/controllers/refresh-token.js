/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import Users from '../models/user-models.js';

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);

    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err) => {
      if (err) return res.sendStatus(403);

      const userId = user.id;
      const { name } = user;
      const { email } = user;
      const { role } = user;
      const accessToken = jwt.sign({
        userId, name, email, role,
      }, process.env.ACCESS_TOKEN, {
        expiresIn: '40s',
      });

      return res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};
