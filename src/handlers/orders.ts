import express, { Request, Response } from "express";
import { verifyAuthentication } from "../middleware/verifyAuthentication";
import { Order, OrderStore } from "../models/order";
import jwt from "jsonwebtoken";

const store = new OrderStore()
const index = async (req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
};

const show = async (req: Request, res: Response) => {
  const orders = await store.showByStatus(req.params.status);
  res.json(orders);
};

const create = async (req: Request, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization
    // @ts-ignore
    const token = authorizationHeader.split(' ')[1]
    const { TOKEN_SECRET } = process.env
    const decoded = await jwt.verify(token, TOKEN_SECRET as string) as unknown
    // @ts-ignore
    const id = decoded.user.id
    if(id === undefined) {
      throw new Error()
    }

    const order: Order = {
      userId: id,
      completed: false,
      items: req.body
    }
    const orders = await store.create(order);
    res.json(orders);
  } catch(err) {
    res.status(500)
    res.json(err)
    return
  }

};

const orderRoute = (app: express.Application) => {
  app.get('/api/orders', verifyAuthentication, index);
  app.get('/api/orders/:status', verifyAuthentication, show);
  app.post('/api/orders', verifyAuthentication, create);
};

export default orderRoute;
