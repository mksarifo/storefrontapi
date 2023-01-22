import { Order, OrderStore } from "../../models/order"
import { User, UserStore } from "../../models/user";
import { Product, ProductStore } from "../../models/product";

const store = new OrderStore()
const userStore = new UserStore()
const productStore = new ProductStore()

let createdId: string;
let existingUser: User;
let existingProduct: Product;

beforeAll(async () => {
  // Create a testing user
  const anEmail = Math.floor(Math.random() * 100) + "order@example.com"
  const someUser = { email: anEmail, firstName: "John", lastName: "Doe", password: "someRandomText" }
  existingUser = await userStore.create(someUser)

  // Create a testing product
  const someProduct: Product = { name: "some", price: 120, category: undefined }
  existingProduct = await productStore.create(someProduct)
})

afterAll(async () => {
  //await userStore.delete(existingUser.id as string)
  //await productStore.delete(existingProduct.id as string)
})
describe("Order Model Test", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined()
  })

  it("Should create a new order", async () => {
    const order: Order = { userId: existingUser.id as string, completed: false, items: [{quantity: 1, productId: existingProduct.id as string}] }
    const createdOrder = await store.create(order)
    expect(createdOrder).toBeDefined()
    expect(createdOrder.id).toBeGreaterThanOrEqual(1)
    expect(createdOrder.items.length).toBeGreaterThanOrEqual(1)
    createdId = createdOrder.id as string;
  })

  it("Should get the created order by ID", async () => {
    const order = await store.show(createdId)
    expect(order).toBeDefined()
    expect(order.id).toEqual(createdId)
  })

  it("Should complete order", async () => {
    const order = await store.complete(createdId)
    expect(order).toBeDefined()
    expect(order.completed).toBeTrue();
  })

  it("Should return an array of Orders", async () => {
    const orders = await store.index()
    expect(orders.length).toBeGreaterThanOrEqual(1)
  })

})
