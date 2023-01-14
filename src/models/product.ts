import Client from '../database';

export type Product = {
  id?: string;
  name: string;
  price: Number;
  category?: string;
};

const entity = 'products';

export class ProductStore {
  async index(): Promise<Product[]> {
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

  async show(id: string): Promise<Product> {
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

  async create(product: Product): Promise<Product> {
    try {
      const sql = `INSERT INTO ${entity} (name, price, category) VALUES($1, $2, $3) RETURNING *`;
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category
      ]);
      const savedProduct = result.rows[0];
      conn.release();
      return savedProduct;
    } catch (err) {
      throw new Error(`Could not add ${entity} ${product.name}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const sql = `DELETE FROM ${entity} WHERE id=($1)`;
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not delete ${entity} ${id}. Error: ${err}`);
    }
  }

  async edit(product: Product): Promise<Product> {
    try {
      const sql = `UPDATE ${entity} SET name=$1, price=$2, category=$3 WHERE id=($4) RETURNING *`;
      // @ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        product.name, product.price, product.category, product.id
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get ${entity} ${product.id}. Error: ${err}`);
    }
  }
}
