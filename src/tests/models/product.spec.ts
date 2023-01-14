import { Product, ProductStore } from "../../models/product"

const store = new ProductStore()
let createdId: string;

afterAll(async () => {
	await store.delete(createdId)
})
describe("Product Model Test", () => {
	it("should have an index method", () => {
		expect(store.index).toBeDefined()
	})

	it("Should create a new product", async () => {
		const product: Product = { name: "some", price: 120, category: undefined }
		const createdProduct = await store.create(product)
		expect(createdProduct).toBeDefined()
		expect(createdProduct.id).toBeGreaterThanOrEqual(1)
      createdId = createdProduct.id as string;
	})

	it("Should get the created product", async () => {
		const product = await store.show(createdId)
		expect(product).toBeDefined()
		expect(product.id).toEqual(createdId)
	})

	it("Should return an array of Products", async () => {
		const products = await store.index()
		expect(products.length).toBeGreaterThanOrEqual(1)
	})

	it("Should remove created product", async () => {
      await store.delete(createdId)
      const product = await store.show(createdId)
      expect(product).toBeUndefined()
  })
})
