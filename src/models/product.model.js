const { DataTypes } = require("sequelize");
const Category = require("./category.model");

const Product = sequelize.define(
  "Product",        // Nombre del modelo
  {
    // ── Identificador único (clave primaria) ──────────────────────────────
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Identificador único del producto"
    },

    // ── Nombre del producto (obligatorio) ────────────────────────────────
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre del producto no puede estar vacío" },
        len: { args: [2, 150], msg: "El nombre debe tener entre 2 y 150 caracteres" }
      },
      comment: "Nombre del producto"
    },

    // ── Descripción detallada ─────────────────────────────────────────────
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Descripción detallada del producto"
    },

    // ── Precio de venta (obligatorio, mayor a 0) ──────────────────────────
    price: {
      type: DataTypes.DECIMAL(10, 2),   // 10 dígitos en total, 2 decimales
      allowNull: false,
      validate: {
        min: { args: [0], msg: "El precio no puede ser negativo" },
        isDecimal: { msg: "El precio debe ser un número decimal válido" }
      },
      comment: "Precio de venta del producto"
    },

    // ── Stock disponible en inventario ────────────────────────────────────
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,                  // Por defecto sin stock
      validate: {
        min: { args: [0], msg: "El stock no puede ser negativo" },
        isInt: { msg: "El stock debe ser un número entero" }
      },
      comment: "Unidades disponibles en inventario"
    },

    // ── URL de la imagen del producto ─────────────────────────────────────
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        // Validamos URL solo si el campo tiene valor (no null ni vacío)
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

    // ── Clave foránea: referencia a la categoría ──────────────────────────
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,                  // Un producto puede no tener categoría asignada
      references: {
        model: "categories",            // Tabla referenciada
        key: "id"
      },
      comment: "Referencia a la categoría del producto (FK)"
    },

    // ── Estado del producto ───────────────────────────────────────────────
    status: {
      type: DataTypes.ENUM("active", "inactive", "out_of_stock"),
      allowNull: false,
      defaultValue: "active",           // Por defecto se crea activo
      comment: "Estado: active / inactive / out_of_stock"
    }
  },
  {
    // ── Opciones del modelo ───────────────────────────────────────────────
    tableName: "products",              // Nombre exacto de la tabla en PostgreSQL
    timestamps: true,                   // Agrega created_at y updated_at automáticamente
    underscored: true                   // Convierte camelCase a snake_case en la BD
  }
);

// ─── Asociaciones (relaciones entre modelos) ──────────────────────────────────
// Un producto pertenece a una categoría (N:1)
Product.belongsTo(Category, {
  foreignKey: "category_id",           // Columna FK en la tabla products
  as: "category"                       // Alias para usar en consultas (include: [{as:"category"}])
});

// Una categoría puede tener muchos productos (1:N)
Category.hasMany(Product, {
  foreignKey: "category_id",
  as: "products"
});

module.exports = Product;