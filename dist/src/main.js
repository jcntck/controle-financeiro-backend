"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_process_1 = __importDefault(require("node:process"));
const node_path_1 = __importDefault(require("node:path"));
const ExpressAdapter_1 = __importDefault(require("./adapters/ExpressAdapter"));
const CategoryController_1 = __importDefault(require("./controller/CategoryController"));
const CategoryJsonRepository_1 = __importDefault(require("./repository/CategoryJsonRepository"));
const CategoryRoutes_1 = __importDefault(require("./routes/CategoryRoutes"));
// Adapters
const httpAdapter = new ExpressAdapter_1.default();
// Categories
const databasePath = node_path_1.default.resolve(node_process_1.default.cwd(), 'data', 'categories.json');
const categoryRepository = new CategoryJsonRepository_1.default(databasePath);
const categoryController = new CategoryController_1.default(categoryRepository);
new CategoryRoutes_1.default(httpAdapter, categoryController);
// run
httpAdapter.listen(3000);
