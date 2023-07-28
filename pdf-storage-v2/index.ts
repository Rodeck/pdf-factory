import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './error-handling/error-middleware';
import router from './metrics';
import winston from 'winston';
import cors from 'cors';
import { templatesRouter } from './templates';
import { dataRouter } from './data';

const serviceName = 'express-service';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {service: serviceName},
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/api/v1', router);
app.use('/api/v1/template', templatesRouter);
app.use('/api/v1/data', dataRouter);

app.listen(port, () => {
  logger.info(`⚡️ starting server on port ${port}`);
});

app.use(errorHandler);