import request from "supertest"
import app from "../../server"
import { Product } from "../../models/product";
import { User, UserStore } from "../../models/user";

let createdProduct: Product;
const userStore = new UserStore()
const url = '/api/products'

let authToken: string;

beforeAll(async () => {

  const anEmail = Math.floor(Math.random() * 100) + "products@example.com"
  const aPassword = "superSecurePassword12345%"
  const user: User = { email: anEmail, firstName: "John", lastName: "Doe", password: aPassword }
  await userStore.create(user)

  const response = await request(app)
    .post('/api/authenticate')
    .send({email: anEmail, password: aPassword})

  authToken = response.body
})

describe("Product API Endpoint Test", () => {

  it("Create a Product", async () => {
    const product: Product = { name: "some", price: 120, category: undefined }
    const productResponse = await request(app)
      .post(url).set({Authorization: `Bearer ${authToken}`}).send(product).expect(200)
    createdProduct = productResponse.body as Product
    expect(createdProduct.id).toBeDefined()
  })

  it("Get a Product", async () => {
    const productResponse = await request(app)
      .get(`${url}/${createdProduct.id}`).set({Authorization: `Bearer ${authToken}`}).expect(200)
    const product = productResponse.body as Product
    expect(product).toEqual(createdProduct)
  })

  it("Edit a Product", async () => {
    createdProduct.category = "Laptop"
    const productResponse = await request(app)
      .put(url).set({Authorization: `Bearer ${authToken}`}).send(createdProduct).expect(200)
    createdProduct = productResponse.body as Product
    expect(createdProduct.id).toBeDefined()
    expect(createdProduct.category).toEqual("Laptop")
  })

  it("Get an array of Products", async () => {
    const productResponse = await request(app)
      .get(url).set({Authorization: `Bearer ${authToken}`})
    const products = productResponse.body as Product[]
    expect(products.length).toBeGreaterThanOrEqual(1);
  })

  it("Get top 5 Products", async () => {
    const productResponse = await request(app)
      .get(`/api/search/top`).set({Authorization: `Bearer ${authToken}`})
    const products = productResponse.body as Product[]
    expect(products.length).toBeGreaterThanOrEqual(1);
  })

  it("Get Products by category", async () => {
    const productResponse = await request(app)
      .get(`/api/search?category=Laptop`).set({Authorization: `Bearer ${authToken}`})
    const products = productResponse.body as Product[]
    expect(products.length).toBeGreaterThanOrEqual(1);
  })

  it("Delete a Product", async () => {
    await request(app)
      .delete(`${url}/${createdProduct.id}`).set({Authorization: `Bearer ${authToken}`}).expect(200)
  })
})
