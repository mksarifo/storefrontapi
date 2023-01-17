import Client from '../database';
import bcrypt from "bcrypt";

export type User = {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
}

const entity = 'users';

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM ${entity}`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get ${entity}. Error: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = `SELECT * FROM ${entity} WHERE id=($1)`;
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get ${entity} ${id}. Error: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    const conn = await Client.connect();
    try {
      const selectSql = `SELECT * FROM ${entity} WHERE email = $1`
      const selectResult = await conn.query(selectSql, [user.email])
      const existingUser = selectResult.rows[0]
      if(existingUser && existingUser.id) {
        throw Error("User with the same email already exists")
      }
      const sql = `INSERT INTO ${entity} (email, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *`;
      const { PEPPER } = process.env
      const hashed = bcrypt.hashSync(
        user.password + PEPPER, 10
      );


      const result = await conn.query(sql, [
        user.email, user.firstName, user.lastName, hashed
      ]);
      const savedUser = result.rows[0];
      conn.release();
      return savedUser;
    } catch (err) {
      conn.release();
      throw new Error(`Could not add ${entity} ${user.email}. ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = `DELETE FROM ${entity} WHERE id=($1)`;
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Could not delete ${entity} ${id}. Error: ${err}`);
    }
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const conn = await Client.connect()
    const sql = 'SELECT * FROM users WHERE email=($1)'
    const { PEPPER } = process.env
    const result = await conn.query(sql, [email])

    if(result.rows.length) {
      let match: boolean;
      const user = result.rows[0]
      match = await bcrypt.compare(password + PEPPER, user.password);
      if (match) {
        // Remove password property so it's not visible in the frontend
        user.password = ""
        return user
      }
    }
    return null
  }
}
