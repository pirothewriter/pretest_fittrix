import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { RegisterRoutes } from '../build/routes';
import swaggerOption from '../build/swagger.json';
import { FittrixError } from './types/exceptions/FittrixError';

const PORT = process.env.PORT || 3000;

export const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

RegisterRoutes(app);

app.use(function errorHandler(
  error: FittrixError | any,
  request: Request,
  response: Response,
  next: NextFunction
): Response | void {
  if (error.statusCode) {
    return response.status(error.statusCode).json({
      message: error?.message,
    });
  }
  if (error instanceof Error) {
    return response.status(500).json({
      message: 'Internal Server Error',
    });
  }

  next();
});

app.use('/api-helper', swaggerUi.serve, swaggerUi.setup(swaggerOption));
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
