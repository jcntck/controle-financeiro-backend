import process from 'node:process';
import path from 'node:path';

import ExpressAdapter from './adapters/ExpressAdapter';

import CategoryController from './controller/CategoryController';
import CategoryDbRepository from './repository/CategoryDbRepository';
import CategoryRoutes from './routes/CategoryRoutes';
import { PgAdapter } from './adapters/PgAdapter';
import DebitTransactionDbRepository from './repository/DebitTransactionDbRepository';
import DebitTransactionController from './controller/DebitTransactionController';
import DebitTransactionRoutes from './routes/DebitTransactionRoutes';

// Adapters
const httpAdapter = new ExpressAdapter();
const dbAdapter = new PgAdapter();

// Repositories
const categoryRepository = new CategoryDbRepository(dbAdapter);
const debitTransactionsRepository = new DebitTransactionDbRepository(dbAdapter);

// Controller
const categoryController = new CategoryController(categoryRepository);
const debitTransactionController = new DebitTransactionController(debitTransactionsRepository);

// Routes
new CategoryRoutes(httpAdapter, categoryController);
new DebitTransactionRoutes(httpAdapter, debitTransactionController);

// run
httpAdapter.listen(3000);
