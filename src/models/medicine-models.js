import { DataTypes } from "sequelize";
import db from "../configs/database.js";

const Medicines = db.define('medicines',{
    name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    class_therapy : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    subclass_therapy1 : {
        type : DataTypes.STRING,
        allowNull : true
    },
    subclass_therapy2 : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    subclass_therapy3 : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    power : {
        type : DataTypes.FLOAT,
        allowNull : false,
    },
    unit : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    type : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    composition : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    drug_restrictions : {
        type : DataTypes.TEXT,
        allowNull : true,
    },
    maximum_prescription : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    
},{
    freezeTableName : true,
});

export default Medicines;