import Client from '../database';

export type User = {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const entity = 'users';

export class UserStore {
  async index(): Promise<User[]> {
    try {
      // @ts-ignore
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
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get ${entity} ${id}. Error: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const sql = `INSERT INTO ${entity} (email, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *`;
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        user.email, user.firstName, user.lastName, user.password
      ]);
      const savedUser = result.rows[0];
      conn.release();
      return savedUser;
    } catch (err) {
      throw new Error(`Could not add ${entity} ${user.email}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = `DELETE FROM ${entity} WHERE id=($1)`;
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Could not delete ${entity} ${id}. Error: ${err}`);
    }
  }
}