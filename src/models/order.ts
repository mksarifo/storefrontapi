import Client from "../database"
import { Item } from "./item"

export type Order = {
	id?: string
	userId: string
	completed: boolean
	items: Item[]
}

const entity = "orders"

export class OrderStore {
	async index(): Promise<Order[]> {
		try {
			const conn = await Client.connect()
			const sql = `SELECT * FROM ${entity}`
			const result = await conn.query(sql)
			conn.release()
			return result.rows
		} catch (err) {
			throw new Error(`Could not get ${entity}. Error: ${err}`)
		}
	}

	async show(id: string): Promise<Order> {
		try {
			const sql = `SELECT * FROM ${entity} WHERE id=($1)`
			// @ts-ignore
			const conn = await Client.connect()
			const result = await conn.query(sql, [id])
			conn.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`Could not get ${entity} ${id}. Error: ${err}`)
		}
	}
	async showByStatus(status: string): Promise<Order[]> {
		try {
			const completed: boolean = status === "completed"
			const sql = `SELECT * FROM ${entity} WHERE completed=($1)`
			const conn = await Client.connect()
			const result = await conn.query(sql, [completed])
			conn.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(
				`Could not get ${entity} with status${status}. Error: ${err}`
			)
		}
	}

	async create(order: Order): Promise<Order> {
		try {
			const sql = `INSERT INTO ${entity} (user_id, completed) VALUES($1, $2) RETURNING *`
			const conn = await Client.connect()
			const result = await conn.query(sql, [order.userId, order.completed])
			const savedOrder = result.rows[0]
			let items: Item[] = []
			for (const item of order.items) {
				const sql_item = `INSERT INTO items (order_id, quantity, product_id, date_added) VALUES($1, $2, $3, $4) RETURNING *`
				const queryResult = await conn.query(sql_item, [
					savedOrder.id,
					item.quantity,
					item.productId,
					new Date()
				])
				const createdItem = queryResult.rows[0]
				items.push(createdItem)
			}
			savedOrder.items = items
			conn.release()
			return savedOrder
		} catch (err) {
			throw new Error(`Could not add ${entity}. Error: ${err}`)
		}
	}

	async complete(id: string): Promise<Order> {
		try {
			const sql = `UPDATE ${entity} SET completed=TRUE WHERE id=($1) RETURNING *`
			const conn = await Client.connect()
			const result = await conn.query(sql, [id])
			conn.release()
			return result.rows[0]
		} catch (err) {
			throw new Error(`Could not get ${entity} ${id}. Error: ${err}`)
		}
	}
}
