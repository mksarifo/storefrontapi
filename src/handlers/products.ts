import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';

const store = new ProductStore();

const url = '/api/products'

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  const product = await store.show(req.params.id);
  res.json(product);
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const edit = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };
    const newProduct = await store.edit(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.id);
  res.json(deleted);
};

const getTop = async (req: Request, res: Response) => {
  const products = await store.top();
  res.json(products);
};
const getByCategory = async (req: Request, res: Response) => {
  const products = await store.getByCategory(req.query.category as string);
  res.json(products);
};

const productRoutes = (app: express.Application) => {
  app.get(url, index);
  app.get(`${url}/:id`, show);
  app.post(url, create);
  app.put(url, edit);
  app.delete(`${url}/:id`, destroy);
  app.get(`/api/search`, getByCategory);
  app.get(`/api/search/top`, getTop);
};

export default productRoutes;
