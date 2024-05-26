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
