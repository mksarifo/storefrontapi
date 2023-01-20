import request from "supertest"
import app from "../../server"
import { User, UserStore } from "../../models/user";
import { Product } from "../../models/product";

let createdUser: User
const url = "/api/users"
const store = new UserStore()
const anEmail = Math.floor(Math.random() * 1000) + "mail@example.com"
let authUser: User
let authToken: string

beforeAll(async () => {
  const user: User = { email: "admin@user", firstName: "John", lastName: "Doe", password: "superSecurePassword12345%" }
  authUser = await store.create(user)
})

afterAll(async () => {
  await store.delete(authUser.id as string)
})

describe("User API Endpoint Test", () => {


  it("Should authenticate user", async () => {
    const token = await request(app)
      .post('/api/authenticate').send({email: "admin@user", password: "superSecurePassword12345%"}).expect(200)
    expect(token.body).toBeDefined()
    authToken = token.body
  })

  it("Create User", async () => {
    const user: User = { email: anEmail, firstName: "John", lastName: "Doe", password: "someRandomText" }
    const userResponse = await request(app)
      .post(url)
      .set({Authorization: `Bearer ${authToken}`})
      .send(user)
      .expect(200)
    createdUser = userResponse.body as User
    expect(createdUser.id).toBeDefined()
  })



  it("Get User", async () => {
    const userResponse = await request(app)
      .get(`${url}/${createdUser.id}`)
      .set({Authorization: `Bearer ${authToken}`})
      .expect(200)
    const user = userResponse.body as User
    expect(user).toEqual(createdUser)
  })

  it("Get an array of Users", async () => {
    const userResponse = await request(app).get(url)
      .set({Authorization: `Bearer ${authToken}`})
    const users = userResponse.body as Product[]
    expect(users.length).toBeGreaterThanOrEqual(1);
  })
})
