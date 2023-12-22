"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class CategoryRoute {
    constructor(httpAdapter, categoryController) {
        this.httpAdapter = httpAdapter;
        this.categoryController = categoryController;
        this.httpAdapter.on('get', '/api/v1/categories', (params, body) => __awaiter(this, void 0, void 0, function* () {
            return this.categoryController.get();
        }));
        this.httpAdapter.on('get', '/api/v1/categories/:id', (params, body) => __awaiter(this, void 0, void 0, function* () {
            return this.categoryController.getById(params.id);
        }));
        this.httpAdapter.on('post', '/api/v1/categories', (params, body) => __awaiter(this, void 0, void 0, function* () {
            return this.categoryController.post(body);
        }));
        this.httpAdapter.on('put', '/api/v1/categories/:id', (params, body) => __awaiter(this, void 0, void 0, function* () {
            return this.categoryController.put(params.id, body);
        }));
        this.httpAdapter.on('delete', '/api/v1/categories/:id', (params, body) => __awaiter(this, void 0, void 0, function* () {
            return this.categoryController.delete(params.id);
        }));
    }
}
exports.default = CategoryRoute;
