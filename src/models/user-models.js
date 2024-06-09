/* eslint-disable import/extensions */
import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import db from '../configs/database.js';

const Users = db.define('users', {
  id: {
    type: DataTypes.STRING, // Menggunakan STRING untuk menampung nilai nanoid
    primaryKey: true, // Menjadikan kolom id sebagai primary key
    allowNull: false,
    defaultValue: () => nanoid(7), // Menetapkan nilai default menggunakan nanoid
    unique: true, // Pastikan setiap id unik
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true, // Menjadikan email sebagai kolom unik
    allowNull: false, // Email tidak boleh null
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user', // Default role is 'user'. Change to 'admin' for admin users.
  },
}, {
  freezeTableName: true,
});

export default Users;
