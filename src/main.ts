import express, {Express, Request, Response} from 'express';
import { PORT } from './secrets';
import rootRouter from './routers';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';

const app:Express = express();

app.use(express.json());

app.use('/', rootRouter)

app.use(errorMiddleware)

export const prismaClient = new PrismaClient({
  log:['query']
}).$extends({
  result: {
      address: {
          formattedAddress: {
              needs: {
                  lineOne: true,
                  lineTwo: true,
                  city: true,
                  country: true,
                  pincode: true
              },
              compute: (addr) => {
                  return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`;
              }
          }
      }
    }
  })

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});