import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(username, password) {
  try {
    const sql = `
        INSERT INTO users (username, password)
        VALUES ($1, $2)
        RETURNING *;
        `;

    const hashPassword = await bcrypt.hash(password, 10);
    const {
      rows: [user],
    } = await db.query(sql, [username, hashPassword]);
    return user;
  } catch (error) {
    console.error("There was an error creating user", error);
  }
}

export async function getUserByUsername(username) {
  try {
    const sql = `
        SELECT *
        FROM users
        WHERE username = $1;
        `;

    const values = [username];
    const {
      rows: [user],
    } = await db.query(sql, values);
    return user || null;
  } catch (error) {
    console.error(`Error getting User`, error);
  }
}

export async function getUserById(id) {
  try {
    const sql = `
        SELECT *
        FROM users
        WHERE id = $1;
        `;

    const values = [id];
    const {
      rows: [user],
    } = await db.query(sql, values);
    return user || null;
  } catch (error) {
    console.error("Error getting user by ID", error);
  }
}
