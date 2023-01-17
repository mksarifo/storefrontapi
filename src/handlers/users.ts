import express, { Request, Response } from 'express';
import { User, UserStore} from "../models/user";
import jwt from "jsonwebtoken";
import { verifyAuthentication } from "../middleware/verifyAuthentication";

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const user = await store.show(req.params.id);
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    };
    const newUser = await store.create(user);
    res.json(newUser);
  } catch (err) {
    console.log(err)
    res.status(400);
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  const user: User = {
    email: req.body.email,
    password: req.body.password,
  }
  try {
    const u = await store.authenticate(user.email, user.password)
    const { TOKEN_SECRET } = process.env
    // @ts-ignore
    const token = jwt.sign({ user: u }, TOKEN_SECRET+"");
    res.json(token)
  } catch(error) {
    res.status(401)
    res.json({ error })
  }
}

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthentication, index);
  app.get('/users/:id', verifyAuthentication, show);
  app.post('/users', create);
  app.post('/authenticate', authenticate)
};

export default userRoutes;
