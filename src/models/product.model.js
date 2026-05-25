import { DataTypes } from "sequelize";
import sequelize from "../config/connect.db.js";
import Category from "./category.model.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Identificador único del producto"
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre del producto no puede estar vacío" },
        len: { args: [2, 150], msg: "El nombre debe tener entre 2 y 150 caracteres" }
      },
      comment: "Nombre del producto"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Descripción detallada del producto"
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: "El precio no puede ser negativo" },
        isDecimal: { msg: "El precio debe ser un número decimal válido" }
      },
      comment: "Precio de venta del producto"
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: "El stock no puede ser negativo" },
        isInt: { msg: "El stock debe ser un número entero" }
      },
      comment: "Unidades disponibles en inventario"
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrlIfPresent(value) {
          if (value && value.trim() !== "") {
            const urlRegex = /^https?:\/\/.+/;
            if (!urlRegex.test(value)) {
              throw new Error("image_url debe ser una URL válida (http:// o https://)");
            }
          }
        }
      },
      comment: "URL de la imagen del producto"
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id"
      },
      comment: "Referencia a la categoría del producto (FK)"
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "out_of_stock"),
      allowNull: false,
      defaultValue: "active",
      comment: "Estado: active / inactive / out_of_stock"
    }
  },
  {
    tableName: "products",
    timestamps: true,
    underscored: true
  }
);

Product.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category"
});

Category.hasMany(Product, {
  foreignKey: "category_id",
  as: "products"
});

export default Product;