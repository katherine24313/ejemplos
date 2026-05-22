import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({ path: '.env' });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,  // ✅ Agregar puerto explícito
        dialect: process.env.DB_DIALECT || 'mysql',  // ✅ Valor por defecto
        logging: false,  // ✅ Opcional: reduce ruido en consola
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();  // ✅ Solo await, sin .then()
        console.log("✅ DATABASE CONNECTED...");
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error.message);
        console.log("\n💡 Posibles causas:");
        console.log("1. MySQL no está ejecutándose");
        console.log("2. Credenciales incorrectas en .env");
        console.log("3. Puerto incorrecto (debe ser 3306)");
        console.log("4. La base de datos no existe");
    }
}

testConnection();
export default sequelize;
