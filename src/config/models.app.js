import sequelize from "../config/connect.db.js";
import UserStatus from "../models/userStatus.model.js";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";


export const modelApp = function intModels(select) {
    if (select) {
        UserStatus.hasMany(User, { foreignKey: { name: "userStatus_fk", field: "userStatus_fk", allowall: true } });
        User.belongsTo(UserStatus, { 
            foreignKey: { name: "userStatus_fk", field: "userStatus_fk", allowall: true }, 
            constraints: true, 
        });
        Role.hasMany(User, { foreignKey: { name: "role.fk", field: "role_fk", allowall: true } });
        User.belongsTo(Role, {
             as: 'Current', 
             foreignKey: { name: "role_fk", field: "role.fk", allowNull: true }, 
             constraints: true,
    });
    sequelize.sync();
}
}