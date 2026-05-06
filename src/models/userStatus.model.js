import sequelize from "../config/connect.db";
import { Model, DataTypes } from "sequelize";

class UserStatus extends Model {};

UserStatus.init({
    userStatus_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userStatus_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique
    },
    userSAtatus_description: {
        type: DataTypes.STRING,
        allowNull: true
    }   
}, {
    sequelize, modelName: "UserStatus"
});
export default UserStatus;