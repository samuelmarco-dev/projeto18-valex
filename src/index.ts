import express, { json } from 'express';
import "express-async-errors";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import morgan from 'morgan';
import helmet from 'helmet';
import chalk from 'chalk';

import routesApp from './routers/index.js';
import { handleError } from './middlewares/errorMiddleware.js';

const appServer = express();
appServer.use(json());
appServer.use(cors());
appServer.use(helmet());
appServer.use(morgan('dev'));

appServer.use(routesApp);
appServer.use(handleError);

const port = +process.env.PORT || 4000;
appServer.listen(port, ()=>{
    console.log(chalk.green(`Server is running on port ${port}`));
});
