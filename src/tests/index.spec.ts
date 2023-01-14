import request from "supertest";
import app from '../server';
describe('Server Test', () => {
  it('Should return 200 if the server is up', async () => {
    await request(app)
      .get(`/`)
      .expect(200);
  });
  it('Should return 404 for unexisting route', async () => {
    await request(app).get('/somerandomroute').expect(404);
  });
});