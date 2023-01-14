import request from "supertest"
import app from "../../server"
import { User } from "../../models/user";
import { Product } from "../../models/product";

let createdUser: User
const url = "/users"

describe("User API Endpoint Test", () => {
  it("Create User", async () => {
    const user: User = { email: "some@email", firstName: "John", lastName: "Doe", password: "someRandomText" }
    const userResponse = await request(app)
      .post(url)
      .send(user)
      .expect(200)
    createdUser = userResponse.body as User
    expect(createdUser.id).toBeDefined()
  })

  it("Get User", async () => {
    const userResponse = await request(app)
      .get(`${url}/${createdUser.id}`).expect(200)
    const user = userResponse.body as User
    expect(user).toEqual(createdUser)
  })

  it("Get an array of Users", async () => {
    const userResponse = await request(app).get(url)
    const users = userResponse.body as Product[]
    expect(users.length).toBeGreaterThanOrEqual(1);
  })
})