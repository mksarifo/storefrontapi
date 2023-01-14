import request from "supertest"
import app from "../../server"
import { Product } from "../../models/product";

let createdProduct: Product;

describe("Product API Endpoint Test", () => {

  it("Create a Product", async () => {
    const product: Product = { name: "some", price: 120, category: undefined }
    const productResponse = await request(app)
      .post(`/products/`).send(product).expect(200)
    createdProduct = productResponse.body as Product
    expect(createdProduct.id).toBeDefined()
  })

  it("Get a Product", async () => {
    const productResponse = await request(app)
      .get(`/products/${createdProduct.id}`).expect(200)
    const product = productResponse.body as Product
    expect(product).toEqual(createdProduct)
  })

  it("Edit a Product", async () => {
    createdProduct.category = "Laptop"
    const productResponse = await request(app)
      .put(`/products/`).send(createdProduct).expect(200)
    createdProduct = productResponse.body as Product
    expect(createdProduct.id).toBeDefined()
    expect(createdProduct.category).toEqual("Laptop")
  })

  it("Get an array of Products", async () => {
    const productResponse = await request(app)
      .get(`/products`)
    const products = productResponse.body as Product[]
    expect(products.length).toBeGreaterThanOrEqual(1);
  })

  it("Delete a Product", async () => {
    await request(app)
      .delete(`/products/${createdProduct.id}`).expect(200)
  })
})