import request from "supertest"
import app from "../../server"
import { Product, ProductStore } from "../../models/product";
import { Order, OrderStore } from "../../models/order";
import { User, UserStore } from "../../models/user";

const url = '/api/orders'
let authToken: string
let openOrder: Order
const productStore = new ProductStore()
const orderStore = new OrderStore()
const userStore = new UserStore()
let existingProducts: Product[] = []

beforeAll(async () => {
  const anEmail = Math.floor(Math.random() * 100) + "orders@example.com"
  const aPassword = "superSecurePassword12345%"
  const user: User = { email: anEmail, firstName: "John", lastName: "Doe", password: aPassword }
  await userStore.create(user)

  const response = await request(app)
    .post('/api/authenticate')
    .send({email: anEmail, password: aPassword})

  authToken = response.body

  // Create a testing product
  const product1: Product = { name: "iPhone 12", price: 12000, category: 'Smartphone' }
  const product2: Product = { name: "MacBook Pro", price: 88000, category: 'Laptop' }
  const product3: Product = { name: "Oranges", price: 120, category: undefined }
  existingProducts.push(await productStore.create(product1))
  existingProducts.push(await productStore.create(product2))
  existingProducts.push(await productStore.create(product3))
})

describe("Orders API Endpoint Test", () => {
  it("Should create a new order", async () => {
    const response = await request(app)
      .post(url)
      .set({Authorization: `Bearer ${authToken}`})
      .send([
        { productId: existingProducts[0].id, quantity: 100 },
        { productId: existingProducts[1].id, quantity: 20 },
        { productId: existingProducts[2].id, quantity: 1 }
      ])
      .expect(200)
  })

  it("Should return an open order", async () => {
    const response = await request(app)
      .get(`${url}/open`)
      .set({Authorization: `Bearer ${authToken}`})
      .expect(200)
    openOrder = response.body
    expect(openOrder.completed).toBeFalse()
  })

  it("Should return a completed order", async ()=> {
    // Complete an open order
    await orderStore.complete(openOrder.id as string)
    const response = await request(app)
      .get(`${url}/completed`)
      .set({Authorization: `Bearer ${authToken}`})
      .expect(200)
    openOrder = response.body
    expect(openOrder.completed).toBeTrue()
  })
})
