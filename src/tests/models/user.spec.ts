import { User, UserStore } from "../../models/user"

const store = new UserStore()
let createdId: string;

afterAll(async () => {
  await store.delete(createdId)
})

const anEmail = Math.floor(Math.random() * 1000) + "user@example.com"
describe("User Model Test", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined()
  })

  it("Should create a new user", async () => {
    const user: User = { email: anEmail, firstName: "John", lastName: "Doe", password: "someRandomText" }
    const createdUser = await store.create(user)
    expect(createdUser).toBeDefined()
    expect(createdUser.id).toBeGreaterThanOrEqual(1)
    createdId = createdUser.id as string;
  })

  it("Should get the created user", async () => {
    const user = await store.show(createdId)
    expect(user).toBeDefined()
    expect(user.id).toEqual(createdId)
  })

  it("Should return an array of Users", async () => {
    const users = await store.index()
    expect(users.length).toBeGreaterThanOrEqual(1)
  })

  it("Should return a not empty array of Users", async () => {
    const products = await store.index()
    expect(products.length).toBeGreaterThanOrEqual(1)
  })

  it("Should authenticate a user", async () => {
    const user = await store.authenticate(anEmail, "someRandomText")
    expect(user).toBeDefined()
    expect(user?.email).toEqual(anEmail)
  })
})
