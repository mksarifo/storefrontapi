import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import productRoutes from './handlers/products';
import morgan from 'morgan';
import helmet from 'helmet';
import userRoutes from "./handlers/users";

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('tiny'));

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

productRoutes(app)
userRoutes(app)

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;