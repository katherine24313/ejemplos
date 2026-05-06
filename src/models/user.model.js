import sequelize from "../config/connect.db.js";
import {Model, DataTypes } from "sequelize";



userStatus.init({
    userStatus_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userStatus_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userStatus_description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},{
    sequelize, modelName: "User_Statuses"});

export default userStatus;