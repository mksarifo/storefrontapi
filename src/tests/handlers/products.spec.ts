import request from "supertest"
import app from "../../server"
import { Product } from "../../models/product";

let createdProduct: Product;
const url = '/api/products'
describe("Product API Endpoint Test", () => {

  it("Create a Product", async () => {
    const product: Product = { name: "some", price: 120, category: undefined }
    const productResponse = await request(app)
      .post(url).send(product).expect(200)
    createdProduct = productResponse.body as Product
    expect(createdProduct.id).toBeDefined()
  })

  it("Get a Product", async () => {
    const productResponse = await request(app)
      .get(`${url}/${createdProduct.id}`).expect(200)
    const product = productResponse.body as Product
    expect(product).toEqual(createdProduct)
  })

  it("Edit a Product", async () => {
    createdProduct.category = "Laptop"
    const productResponse = await request(app)
      .put(url).send(createdProduct).expect(200)
    createdProduct = productResponse.body as Product
    expect(createdProduct.id).toBeDefined()
    expect(createdProduct.category).toEqual("Laptop")
  })

  it("Get an array of Products", async () => {
    const productResponse = await request(app)
      .get(url)
    const products = productResponse.body as Product[]
    expect(products.length).toBeGreaterThanOrEqual(1);
  })

  it("Get top 5 Products", async () => {
    const productResponse = await request(app)
      .get(`/api/search/top`)
    const products = productResponse.body as Product[]
    expect(products.length).toBeGreaterThanOrEqual(1);
  })

  it("Get Products by category", async () => {
    const productResponse = await request(app)
      .get(`/api/search?category=Laptop`)
    const products = productResponse.body as Product[]
    expect(products.length).toBeGreaterThanOrEqual(1);
  })

  it("Delete a Product", async () => {
    await request(app)
      .delete(`${url}/${createdProduct.id}`).expect(200)
  })
})