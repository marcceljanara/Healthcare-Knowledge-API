/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import cookieParser from 'cookie-parser';
import {
  getUsers, Register, Login, Logout, changePassword,
} from '../src/controllers/users.js';
import { authenticateToken, verifyToken } from '../src/middleware/verify-token.js';
import Users from '../src/models/user-models.js';

// Mock middleware
jest.mock('../src/middleware/verify-token.js', () => ({
  verifyToken: (req, res, next) => {
    req.userId = 'test-user-id';
    req.role = req.headers.role || 'user'; // Default to 'user' if not set
    next();
  },
  authenticateToken: (req, res, next) => {
    next();
  },
}));

// Mock model
jest.mock('../src/models/user-models.js');

// Setup Express app
const app = express();
app.use(cookieParser());
app.use(express.json());
app.get('/api/users', verifyToken, authenticateToken, getUsers);
app.post('/api/users', Register);
app.post('/api/login', Login);
app.delete('/api/logout', verifyToken, Logout);
app.put('/api/password', verifyToken, changePassword);

describe('Users API', () => {
  // Register Tests
  describe('POST /api/users', () => {
    it('should register a new user', async () => {
      Users.findOne.mockResolvedValue(null);
      Users.create.mockResolvedValue({});
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User', email: 'test@example.com', password: 'password', confpassword: 'password',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.msg).toBe('Registrasi Berhasil');
    });

    it('should not register user with existing email', async () => {
      Users.findOne.mockResolvedValue({ email: 'test@example.com' });
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User', email: 'test@example.com', password: 'password', confpassword: 'password',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('Email sudah terdaftar. Silakan gunakan email lain.');
    });

    it('should not register user with unmatched passwords', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User', email: 'test@example.com', password: 'password', confpassword: 'differentpassword',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('Password dan Konfirmasi Password Tidak Cocok');
    });
  });

  // Login Tests
  describe('POST /api/login', () => {
    it('should login a user with correct credentials', async () => {
      const mockUser = {
        id: 'test-user-id', name: 'Test User', email: 'test@example.com', password: 'password', role: 'user',
      };
      Users.findOne.mockResolvedValue(mockUser);
      bcryptjs.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue('mockAccessToken');

      const res = await request(app)
        .post('/api/login')
        .send({ email: 'test@example.com', password: 'password' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.accessToken).toBe('mockAccessToken');
    });

    it('should not login a user with incorrect email', async () => {
      Users.findOne.mockResolvedValue(null);
      const res = await request(app)
        .post('/api/login')
        .send({ email: 'wrong@example.com', password: 'password' });
      expect(res.statusCode).toEqual(404);
      expect(res.body.msg).toBe('Email tidak ditemukan');
    });

    it('should not login a user with incorrect password', async () => {
      const mockUser = {
        id: 'test-user-id', name: 'Test User', email: 'test@example.com', password: 'password', role: 'user',
      };
      Users.findOne.mockResolvedValue(mockUser);
      bcryptjs.compare = jest.fn().mockResolvedValue(false);

      const res = await request(app)
        .post('/api/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('Password salah');
    });
  });

  // Logout Tests
  describe('DELETE /api/logout', () => {
    it('should logout a user', async () => {
      const mockUser = { id: 'test-user-id', refresh_token: 'mockRefreshToken' };
      Users.findOne.mockResolvedValue(mockUser);
      Users.update.mockResolvedValue([1]);

      const res = await request(app)
        .delete('/api/logout')
        .set('Cookie', ['refreshToken=mockRefreshToken']);
      expect(res.statusCode).toEqual(200);
      expect(res.body.msg).toBe('Telah logout');
    });

    it('should not logout a user without refresh token', async () => {
      const res = await request(app)
        .delete('/api/logout');
      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('Refresh token tidak ada');
    });
  });

  // Change Password Tests
  describe('PUT /api/password', () => {
    it('should change password for user with correct old password', async () => {
      const mockUser = { id: 'test-user-id', password: 'oldpassword' };
      Users.findOne.mockResolvedValue(mockUser);
      bcryptjs.compare = jest.fn().mockResolvedValue(true);
      bcryptjs.hash = jest.fn().mockResolvedValue('newhashedpassword');
      Users.update.mockResolvedValue([1]);

      const res = await request(app)
        .put('/api/password')
        .send({ oldPassword: 'oldpassword', newPassword: 'newpassword', confNewPassword: 'newpassword' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.msg).toBe('Password berhasil diubah');
    });

    it('should not change password for user with incorrect old password', async () => {
      const mockUser = { id: 'test-user-id', password: 'oldpassword' };
      Users.findOne.mockResolvedValue(mockUser);
      bcryptjs.compare = jest.fn().mockResolvedValue(false);

      const res = await request(app)
        .put('/api/password')
        .send({ oldPassword: 'wrongoldpassword', newPassword: 'newpassword', confNewPassword: 'newpassword' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('Password lama salah');
    });

    it('should not change password if new password and confirmation do not match', async () => {
      const res = await request(app)
        .put('/api/password')
        .send({ oldPassword: 'oldpassword', newPassword: 'newpassword', confNewPassword: 'differentnewpassword' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('Password baru dan Konfirmasi Password Tidak Cocok');
    });
  });

  // Get Users Tests
  describe('GET /api/users', () => {
    it('should return all users for admin role', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' },
      ];
      Users.findAll.mockResolvedValue(mockUsers);

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer mockToken')
        .set('role', 'admin'); // Simulate admin role
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockUsers);
    });

    it('should return single user data for non-admin role', async () => {
      const mockUser = { id: 'test-user-id', name: 'Test User', email: 'test@example.com' };
      Users.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer mockToken')
        .set('role', 'user'); // Simulate non-admin role
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockUser);
    });

    it('should return 404 if user not found', async () => {
      Users.findOne.mockResolvedValue(null);
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer mockToken')
        .set('role', 'user'); // Simulate non-admin role
      expect(res.statusCode).toEqual(404);
      expect(res.body.msg).toBe('Pengguna tidak ditemukan');
    });
  });
});
