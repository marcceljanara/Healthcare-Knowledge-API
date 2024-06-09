/* eslint-disable no-undef */
/* eslint-disable import/extensions */
// Import necessary dependencies and test suite setup
import request from 'supertest';
import express from 'express';
import {
  createMedicine,
  getMedicines,
  getMedicinesDoctor,
  getDetailMedicineById,
  updateMedicine,
  deleteMedicineById,
} from '../src/controllers/medicines.js';
import Medicines from '../src/models/medicine-models.js';

// Mocking dependencies
jest.mock('../src/models/medicine-models.js');

// Setup Express app
const app = express();
app.use(express.json());
app.post('/api/medicines', createMedicine);
app.get('/api/medicines', getMedicines);
app.get('/api/medicines/doctor', getMedicinesDoctor);
app.get('/api/medicines/:id', getDetailMedicineById);
app.put('/api/medicines/:id', updateMedicine);
app.delete('/api/medicines/:id', deleteMedicineById);

describe('Medicines API', () => {
  // Create Medicine Endpoint Tests
  describe('POST /api/medicines', () => {
    // Positive Test
    it('should create a new medicine', async () => {
      // Mock successful database operation
      Medicines.create.mockResolvedValue({});

      // Send request to create medicine
      const res = await request(app)
        .post('/api/medicines')
        .send({
          name: 'Medicine 1',
          classTherapy: 'Class 1',
          power: 10,
          unit: 'mg',
          type: 'Type 1',
        });

      // Assert response
      expect(res.statusCode).toEqual(201);
      expect(res.body.msg).toBe('Data obat berhasil ditambahkan');
    });

    // Negative Tests
    it('should return an error when required fields are missing', async () => {
      // Send request with missing required fields
      const res = await request(app)
        .post('/api/medicines')
        .send({
          name: 'Medicine 1',
          classTherapy: 'Class 1',
          power: 10,
          // Missing 'unit' and 'type'
        });

      // Assert response
      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('Gagal menambahkan obat. Mohon mengisi data wajib');
    });

    it('should return an error when database operation fails', async () => {
      // Mock failed database operation
      Medicines.create.mockRejectedValue(new Error('Database operation failed'));

      // Send request to create medicine
      const res = await request(app)
        .post('/api/medicines')
        .send({
          name: 'Medicine 1',
          classTherapy: 'Class 1',
          power: 10,
          unit: 'mg',
          type: 'Type 1',
        });

      // Assert response
      expect(res.statusCode).toEqual(500);
      expect(res.body.msg).toBe('Data obat gagal ditambahkan');
    });
  });

  // Get Medicines Endpoint Tests
  describe('GET /api/medicines', () => {
    // Positive Test
    it('should return a list of medicines with pagination', async () => {
      // Mock successful database operation
      Medicines.findAll.mockResolvedValue([]);

      // Send request to get medicines
      const res = await request(app)
        .get('/api/medicines')
        .query({ limit: 10, page: 1 });

      // Assert response
      expect(res.statusCode).toEqual(200);
      // Add assertions for pagination data
    });

    // Negative Test
    it('should return an error when database operation fails', async () => {
      // Mock failed database operation
      Medicines.findAll.mockRejectedValue(new Error('Database operation failed'));

      // Send request to get medicines
      const res = await request(app)
        .get('/api/medicines')
        .query({ limit: 10, page: 1 });

      // Assert response
      expect(res.statusCode).toEqual(500);
      expect(res.body.msg).toBe('Gagal mengambil data obat');
    });
  });

  // Get Medicines for Doctor Endpoint Tests
  describe('GET /api/medicines/doctor', () => {
    // Positive Test
    it('should return a list of medicines for a doctor with pagination', async () => {
      // Mock successful database operation
      Medicines.findAll.mockResolvedValue([]);

      // Send request to get medicines for doctor
      const res = await request(app)
        .get('/api/medicines/doctor')
        .query({ limit: 10, page: 1 });

      // Assert response
      expect(res.statusCode).toEqual(200);
      // Add assertions for pagination data
    });

    // Negative Test
    it('should return an error when database operation fails', async () => {
      // Mock failed database operation
      Medicines.findAll.mockRejectedValue(new Error('Database operation failed'));

      // Send request to get medicines for doctor
      const res = await request(app)
        .get('/api/medicines/doctor')
        .query({ limit: 10, page: 1 });

      // Assert response
      expect(res.statusCode).toEqual(500);
      expect(res.body.msg).toBe('Gagal mengambil data obat');
    });
  });

  // Get Detail Medicine by ID Endpoint Tests
  describe('GET /api/medicines/:id', () => {
    // Positive Test
    it('should return the detail of a medicine by ID', async () => {
      // Mock successful database operation
      Medicines.findByPk.mockResolvedValue({});

      // Send request to get detail of medicine by ID
      const res = await request(app)
        .get('/api/medicines/1');

      // Assert response
      expect(res.statusCode).toEqual(200);
      // Add assertions for medicine detail
    });

    // Negative Tests
    it('should return an error when the requested medicine is not found', async () => {
      // Mock database operation returning null (medicine not found)
      Medicines.findByPk.mockResolvedValue(null);

      // Send request to get detail of medicine by ID
      const res = await request(app)
        .get('/api/medicines/999');

      // Assert response
      expect(res.statusCode).toEqual(404);
      expect(res.body.msg).toBe('Data obat tidak ditemukan');
    });

    it('should return an error when database operation fails', async () => {
      // Mock failed database operation
      Medicines.findByPk.mockRejectedValue(new Error('Database operation failed'));

      // Send request to get detail of medicine by ID
      const res = await request(app)
        .get('/api/medicines/1');

      // Assert response
      expect(res.statusCode).toEqual(500);
      expect(res.body.msg).toBe('Gagal mengambil data obat');
    });
  });

  // Update Medicine Endpoint Tests
  describe('PUT /api/medicines/:id', () => {
    // Positive Test
    it('should update a medicine successfully', async () => {
      // Mock successful database operation
      Medicines.findByPk.mockResolvedValue({});
      Medicines.update.mockResolvedValue([1]); // Indicates one row was updated

      // Send request to update a medicine
      const res = await request(app)
        .put('/api/medicines/1')
        .send({
          // Add fields to update
          name: 'Updated Medicine Name',
          classTherapy: 'Updated Class Therapy',
          // Add other fields as needed
        });

      // Assert response
      expect(res.statusCode).toEqual(200);
      expect(res.body.msg).toBe('Data obat berhasil diperbarui');
    });

    // Negative Tests
    it('should return an error when the requested medicine is not found', async () => {
      // Mock database operation returning null (medicine not found)
      Medicines.findByPk.mockResolvedValue(null);

      // Send request to update a medicine
      const res = await request(app)
        .put('/api/medicines/999')
        .send({
          // Add fields to update
          name: 'Updated Medicine Name',
          classTherapy: 'Updated Class Therapy',
          // Add other fields as needed
        });

      // Assert response
      expect(res.statusCode).toEqual(404);
      expect(res.body.msg).toBe('Obat tidak ditemukan');
    });

    it('should return an error when database operation fails', async () => {
      // Mock failed database operation
      Medicines.findByPk.mockResolvedValue({});
      Medicines.update.mockRejectedValue(new Error('Database operation failed'));

      // Send request to update a medicine
      const res = await request(app)
        .put('/api/medicines/1')
        .send({
          // Add fields to update
          name: 'Updated Medicine Name',
          classTherapy: 'Updated Class Therapy',
          // Add other fields as needed
        });

      // Assert response
      expect(res.statusCode).toEqual(500);
      expect(res.body.msg).toBe('Data obat gagal diperbarui');
    });
  });

  // Delete Medicine Endpoint Tests
  describe('DELETE /api/medicines/:id', () => {
    // Positive Test
    it('should delete a medicine successfully', async () => {
      // Mock successful database operation
      Medicines.findByPk.mockResolvedValue({});
      Medicines.destroy.mockResolvedValue(1); // Indicates one row was deleted

      // Send request to delete a medicine
      const res = await request(app)
        .delete('/api/medicines/1');

      // Assert response
      expect(res.statusCode).toEqual(200);
      expect(res.body.msg).toBe('Data obat berhasil dihapus');
    });

    // Negative Tests
    it('should return an error when the requested medicine is not found', async () => {
      // Mock database operation returning null (medicine not found)
      Medicines.findByPk.mockResolvedValue(null);

      // Send request to delete a medicine
      const res = await request(app)
        .delete('/api/medicines/999');

      // Assert response
      expect(res.statusCode).toEqual(404);
      expect(res.body.msg).toBe('Data obat tidak ditemukan');
    });

    it('should return an error when database operation fails', async () => {
      // Mock failed database operation
      Medicines.findByPk.mockResolvedValue({});
      Medicines.destroy.mockRejectedValue(new Error('Database operation failed'));

      // Send request to delete a medicine
      const res = await request(app)
        .delete('/api/medicines/1');

      // Assert response
      expect(res.statusCode).toEqual(500);
      expect(res.body.msg).toBe('Gagal menghapus data obat');
    });
  });
});
