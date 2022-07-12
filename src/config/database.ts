import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const dev = {
    connectionString: process.env.DATABASE_URL
}
const prod = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}

const connection: pg.Pool = new Pool(
    process.env.MODE === "PROD" ? prod : dev
);

export default connection;
