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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../core/entity/Category"));
const ValidationError_1 = __importDefault(require("../helpers/ValidationError"));
class CategoryController {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.categoryRepository.getAll();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number(id))
                throw new ValidationError_1.default('Id provided must be a number', 400);
            return this.categoryRepository.getById(Number(id));
        });
    }
    post(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = new Category_1.default(body.name, body.color);
            return this.categoryRepository.save(category);
        });
    }
    put(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number(id))
                throw new ValidationError_1.default('Id provided must be a number', 400);
            const category = new Category_1.default(body.name, body.color, Number(id));
            return this.categoryRepository.save(category);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number(id))
                throw new ValidationError_1.default('Id provided must be a number', 400);
            return this.categoryRepository.delete(Number(id));
        });
    }
}
exports.default = CategoryController;
