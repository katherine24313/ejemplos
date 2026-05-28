import sequelize from "../config/connect.db.js";
import { DataTypes } from "sequelize";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Identificador único de la categoría"
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El nombre no puede estar vacío" },
        len: { args: [2, 100], msg: "El nombre debe tener entre 2 y 100 caracteres" }
      },
      comment: "Nombre único de la categoría"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Descripción detallada de la categoría"
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id"
      },
      comment: "Referencia a la categoría padre para subcategorías"
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      comment: "Estado de la categoría: active o inactive"
    }
  },
  {
    tableName: "categories",
    timestamps: true,
    underscored: true
  }
);

Category.belongsTo(Category, {
  foreignKey: "parent_id",
  as: "parent"
});

Category.hasMany(Category, {
  foreignKey: "parent_id",
  as: "subcategories"
});

export default Category;