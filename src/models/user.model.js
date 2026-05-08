import { da } from "@faker-js/faker";
import sequelize from "../config/connect.db.js";
import {Model, DataTypes } from "sequelize";

class User extends Model {}

    User.init({
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_user: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    user_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userStatus_fk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User_Statuses",
            key: "userStatus_id"
        }
    },
    role_fk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Roles",
            key: "role_id"
        }
    }

},{
    sequelize, modelName: "User"
});

export default User;