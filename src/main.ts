import process from 'node:process';
import path from 'node:path';

import ExpressAdapter from './adapters/ExpressAdapter';

import CategoryController from './controller/CategoryController';
import CategoryDbRepository from './repository/CategoryDbRepository';
import CategoryRoutes from './routes/CategoryRoutes';
import { PgAdapter } from './adapters/PgAdapter';

// Adapters
const httpAdapter = new ExpressAdapter();
const dbAdapter = new PgAdapter();

// Categories
const categoryRepository = new CategoryDbRepository(dbAdapter);
const categoryController = new CategoryController(categoryRepository);
new CategoryRoutes(httpAdapter, categoryController);

// run
httpAdapter.listen(3000);
