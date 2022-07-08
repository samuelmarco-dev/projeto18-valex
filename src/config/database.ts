import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const connection: pg.Pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default connection;
