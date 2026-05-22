
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define(
  "Category",       // Nombre del modelo
  {
    // ── Identificador único (clave primaria) ──────────────────────────────
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,  // PostgreSQL lo maneja con SERIAL
      comment: "Identificador único de la categoría"
    },

    // ── Nombre de la categoría (obligatorio) ──────────────────────────────
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,                 // Campo requerido
      unique: true,                     // No puede haber dos categorías con el mismo nombre
      validate: {
        notEmpty: { msg: "El nombre no puede estar vacío" },
        len: { args: [2, 100], msg: "El nombre debe tener entre 2 y 100 caracteres" }
      },
      comment: "Nombre único de la categoría"
    },

    // ── Descripción opcional ──────────────────────────────────────────────
    description: {
      type: DataTypes.TEXT,
      allowNull: true,                  // Campo opcional
      comment: "Descripción detallada de la categoría"
    },

    // ── Estado de la categoría ────────────────────────────────────────────
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",           // Por defecto se crea activa
      comment: "Estado de la categoría: active o inactive"
    }
  },
  {
    // ── Opciones del modelo ───────────────────────────────────────────────
    tableName: "categories",            // Nombre exacto de la tabla en PostgreSQL
    timestamps: true,                   // Sequelize agrega createdAt y updatedAt automáticamente
    underscored: true                   // Usa snake_case en la BD (created_at, updated_at)
  }
);

module.exports = Category;