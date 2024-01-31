"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressAdapter_1 = __importDefault(require("./adapters/ExpressAdapter"));
const CategoryController_1 = __importDefault(require("./controller/CategoryController"));
const CategoryDbRepository_1 = __importDefault(require("./repository/CategoryDbRepository"));
const CategoryRoutes_1 = __importDefault(require("./routes/CategoryRoutes"));
const PgAdapter_1 = require("./adapters/PgAdapter");
// Adapters
const httpAdapter = new ExpressAdapter_1.default();
const dbAdapter = new PgAdapter_1.PgAdapter();
// Categories
const categoryRepository = new CategoryDbRepository_1.default(dbAdapter);
const categoryController = new CategoryController_1.default(categoryRepository);
new CategoryRoutes_1.default(httpAdapter, categoryController);
// run
httpAdapter.listen(3000);
