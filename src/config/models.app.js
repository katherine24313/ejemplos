import sequelize from "../config/connect.db.js";
import UserStatus from "..models/userStatus.model.js";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";


export const modelApp = function intModels(select) {
    if (select) {
        UserStatus.hasMany(User, { foreignKey: { name: "userStatus_FK", field: "userStatus_FK", allowall: true } });
        User.belongsTo(UserStatus, { 
            foreignKey: { name: "userStatus_FK", field: "userStatus_fk", allowall: true }, 
            constraints: true, 
        });
        Role.hasMany(User, { foreignKey: { name: "role.FK", field: "role_FK", allowall: true } });
        User.belongsTo(Role, {
             as: 'Current', 
             foreignKey: { name: "role_FK", field: "role.fk", allowNull: true }, 
             constraints: true,
    });
    sequelize.sync();
}
}