import { query } from "@/lib/db";
import { User } from "@/lib/interface";

interface UserWithId extends User {
  id: number;
}

export const getUserById = async (id: number) => {
  const rows = await query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] as UserWithId;
};

export const getUserByEmail = async (email: string) => {
  const rows = await query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] as UserWithId;
};

export const getUsers = async () => {
  const rows = await query("SELECT * FROM users", []);
  return rows as UserWithId[];
};

export const createUser = async (user: User) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    dob,
    gender,
    address,
  } = user;
  const rows = await query(
    `INSERT INTO users (first_name, last_name, email, password, phone, dob, gender, address, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         RETURNING *`,
    [first_name, last_name, email, password, phone, dob, gender, address]
  );
  return rows;
};

export const updateUserById = async (id: number, user: User) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    dob,
    gender,
    address,
  } = user;
  const rows = await query(
    `UPDATE users
         SET first_name = $1, last_name = $2, email = $3, password = $4, phone = $5, dob = $6, gender = $7, address = $8
         WHERE id = $9
         RETURNING *`,
    [first_name, last_name, email, password, phone, dob, gender, address, id]
  );

  return rows;
};
