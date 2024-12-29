import { Pool } from "pg";

// Configure the database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query = async (text: string, params: any) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
};
