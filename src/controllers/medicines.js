import { Op } from "sequelize";
import Medicines from "../models/medicine-models.js";


export const createMedicine = async (req, res) => {
    const {
        name, classTherapy, subClassTherapy1, subClassTherapy2, subClassTherapy3,
        power, unit, type, composition, drugRestrictions, maximumPrescription
    } = req.body;

    // Array untuk validasi data wajib
    const requiredFields = [name, classTherapy, power, unit, type];
    
    // Validasi data wajib
    for (const field of requiredFields) {
        if (!field) {
            return res.status(400).json({
                msg: "Gagal menambahkan obat. Mohon mengisi data wajib"
            });
        }
    }

    try {
        // Membuat data obat baru
        await Medicines.create({
            name: name,
            class_therapy: classTherapy,
            subclass_therapy1: subClassTherapy1,
            subclass_therapy2: subClassTherapy2,
            subclass_therapy3: subClassTherapy3,
            power: power,
            unit: unit,
            type: type,
            composition: composition,
            drug_restrictions: drugRestrictions,
            maximum_prescription: maximumPrescription,
            user_id: req.userId,
        });

        // Mengirim respon berhasil
        return res.status(200).json({
            msg: "Data obat berhasil ditambahkan"
        });

    } catch (error) {
        // Mengirim respon error
        return res.status(500).json({
            msg: "Data obat gagal ditambahkan"
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
                    { name: { [Op.like]: `%${searchQuery}%` } },
                    { class_therapy: { [Op.like]: `%${searchQuery}%` } },
                    { drug_restrictions: { [Op.like]: `%${searchQuery}%` } }
                ]
            };
        }

        // Mengambil data obat dengan memperhitungkan limit, offset, dan pencarian
        const medicines = await Medicines.findAll({
            limit: limit,
            offset: offset,
            where: whereClause
        });

        // Menghitung total data
        const totalCount = await Medicines.count({
            where: whereClause
        });

        // Menghitung total halaman
        const totalPages = Math.ceil(totalCount / limit);

        // Mengirim respon dengan data obat dan informasi halaman
        return res.status(200).json({
            medicines: medicines,
            page: page,
            limit: limit,
            totalPages: totalPages
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Gagal mengambil data obat"
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
                    { name: { [Op.like]: `%${searchQuery}%` } },
                    { class_therapy: { [Op.like]: `%${searchQuery}%` } },
                    { drug_restrictions: { [Op.like]: `%${searchQuery}%` } }
                ]
            };
        }

        // Mengambil data obat dengan memperhitungkan limit, offset, dan pencarian
        const medicines = await Medicines.findAll({
            limit: limit,
            offset: offset,
            where: whereClause
        });

        // Menghitung total data
        const totalCount = await Medicines.count({
            where: whereClause
        });

        // Menghitung total halaman
        const totalPages = Math.ceil(totalCount / limit);

        // Mengirim respon dengan data obat dan informasi halaman
        return res.status(200).json({
            medicines: medicines,
            page: page,
            limit: limit,
            totalPages: totalPages
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Gagal mengambil data obat"
        });
    }
};
