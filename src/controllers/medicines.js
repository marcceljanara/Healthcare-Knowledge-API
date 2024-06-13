/* eslint-disable import/extensions */
/* eslint-disable radix */
import { Op } from 'sequelize';
import Medicines from '../models/medicine-models.js';

export const createMedicine = async (req, res) => {
  const {
    name, classTherapy, subClassTherapy1, subClassTherapy2, subClassTherapy3,
    power, unit, type, composition, drugRestrictions, maximumPrescription,
  } = req.body;

  // Array untuk validasi data wajib
  const requiredFields = [name, classTherapy, power, unit, type];

  // Validasi data wajib
  for (const field of requiredFields) {
    if (!field) {
      return res.status(400).json({
        msg: 'Gagal menambahkan obat. Mohon mengisi data wajib',
      });
    }
  }

  try {
    // Membuat data obat baru
    await Medicines.create({
      name,
      class_therapy: classTherapy,
      subclass_therapy1: subClassTherapy1,
      subclass_therapy2: subClassTherapy2,
      subclass_therapy3: subClassTherapy3,
      power,
      unit,
      type,
      composition,
      drug_restrictions: drugRestrictions,
      maximum_prescription: maximumPrescription,
      user_id: req.userId,
    });

    // Mengirim respon berhasil
    return res.status(201).json({
      msg: 'Data obat berhasil ditambahkan',
    });
  } catch (error) {
    // Mengirim respon error
    return res.status(500).json({
      msg: 'Data obat gagal ditambahkan',
    });
  }
};

export const getMedicines = async (req, res) => {
  try {
    // Mengambil parameter limit, offset, dan search dari query string
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || '';

    // Menyiapkan klausa where untuk pencarian
    let whereClause = {};
    if (searchQuery) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchQuery}%` } },
          { class_therapy: { [Op.iLike]: `%${searchQuery}%` } },
          { drug_restrictions: { [Op.iLike]: `%${searchQuery}%` } },
        ],
      };
    }

    // Mengambil data obat dengan memperhitungkan limit, offset, dan pencarian
    const medicines = await Medicines.findAll({
      attributes: ['id', 'name', 'class_therapy', 'drug_restrictions'],
      limit,
      offset,
      where: whereClause,
      order: [['id', 'ASC']],
    });

    // Menghitung total data
    const totalCount = await Medicines.count({
      where: whereClause,
    });

    // Menghitung total halaman
    const totalPages = Math.ceil(totalCount / limit);

    // Mengirim respon dengan data obat dan informasi halaman
    return res.status(200).json({
      medicines,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Gagal mengambil data obat',
    });
  }
};

export const getMedicinesDoctor = async (req, res) => {
  try {
    // Mengambil parameter limit, offset, dan search dari query string
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || '';

    // Menyiapkan filter berdasarkan role dan pencarian
    let whereClause = {};
    if (req.userRole !== 'admin') {
      whereClause.user_id = req.userId; // Filter data berdasarkan user_id jika bukan admin
    }

    if (searchQuery) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchQuery}%` } },
          { class_therapy: { [Op.iLike]: `%${searchQuery}%` } },
          { drug_restrictions: { [Op.iLike]: `%${searchQuery}%` } },
        ],
      };
    }

    // Mengambil data obat dengan memperhitungkan limit, offset, dan pencarian
    const medicines = await Medicines.findAll({
      attributes: ['id', 'name', 'class_therapy', 'drug_restrictions'],
      limit,
      offset,
      where: whereClause,
      order: [['id', 'ASC']],
    });

    // Menghitung total data
    const totalCount = await Medicines.count({
      where: whereClause,
    });

    // Menghitung total halaman
    const totalPages = Math.ceil(totalCount / limit);

    // Mengirim respon dengan data obat dan informasi halaman
    return res.status(200).json({
      medicines,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Gagal mengambil data obat',
    });
  }
};

export const getDetailMedicineById = async (req, res) => {
  try {
    // Mengambil parameter ID dari URL
    const { id } = req.params;

    // Mengambil detail obat berdasarkan ID
    const medicine = await Medicines.findByPk(id);

    // Jika data obat tidak ditemukan, kembalikan status 404
    if (!medicine) {
      return res.status(404).json({
        msg: 'Data obat tidak ditemukan',
      });
    }

    // Mengirim respon dengan data obat
    return res.status(200).json(medicine);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Gagal mengambil data obat',
    });
  }
};

export const updateMedicine = async (req, res) => {
  const { id } = req.params; // Mendapatkan id dari parameter URL
  const {
    name, classTherapy, subClassTherapy1, subClassTherapy2, subClassTherapy3,
    power, unit, type, composition, drugRestrictions, maximumPrescription,
  } = req.body;

  try {
    // Mengambil data obat berdasarkan id
    const medicine = await Medicines.findByPk(id);

    if (!medicine) {
      return res.status(404).json({
        msg: 'Obat tidak ditemukan',
      });
    }

    // Memeriksa apakah pengguna memiliki izin untuk memperbarui obat (jika bukan admin)
    if (req.userRole !== 'admin' && medicine.user_id !== req.userId) {
      return res.status(403).json({
        msg: 'Anda tidak memiliki izin untuk memperbarui obat ini',
      });
    }

    // Memperbarui data obat
    await Medicines.update({
      name,
      class_therapy: classTherapy,
      subclass_therapy1: subClassTherapy1,
      subclass_therapy2: subClassTherapy2,
      subclass_therapy3: subClassTherapy3,
      power,
      unit,
      type,
      composition,
      drug_restrictions: drugRestrictions,
      maximum_prescription: maximumPrescription,
    }, {
      where: {
        id,
      },
    });

    // Mengirim respon berhasil
    return res.status(200).json({
      msg: 'Data obat berhasil diperbarui',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Data obat gagal diperbarui',
    });
  }
};

export const deleteMedicineById = async (req, res) => {
  try {
    // Mengambil parameter ID dari URL
    const { id } = req.params;

    // Mengambil data obat berdasarkan ID
    const medicine = await Medicines.findByPk(id);

    // Jika data obat tidak ditemukan, kembalikan status 404
    if (!medicine) {
      return res.status(404).json({
        msg: 'Data obat tidak ditemukan',
      });
    }

    // Menghapus data obat berdasarkan ID
    await Medicines.destroy({
      where: {
        id,
      },
    });

    // Mengirim respon berhasil
    return res.status(200).json({
      msg: 'Data obat berhasil dihapus',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Gagal menghapus data obat',
    });
  }
};
