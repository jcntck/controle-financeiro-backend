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
const node_fs_1 = __importDefault(require("node:fs"));
const Category_1 = __importDefault(require("../core/entity/Category"));
const ValidationError_1 = __importDefault(require("../helpers/ValidationError"));
class CategoryJsonRepository {
    constructor(databasePath) {
        this.databasePath = databasePath;
        this.categories = new Map();
        this.initDatabase();
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return Array.from(this.categories.values());
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loadData();
            return this.categories.get(id) || null;
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loadData();
            return this.categories.size;
        });
    }
    save(category) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!category.id) {
                category.id = this.generateId();
            }
            if (this.fieldIsNotUnique(category, 'name') || this.fieldIsNotUnique(category, 'color')) {
                throw new ValidationError_1.default('Category already exists with this name or color', 422);
            }
            this.categories.set(category.id, category);
            this.writeData();
            return category.id;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.categories.delete(id);
            this.writeData();
        });
    }
    initDatabase() {
        const databaseExists = node_fs_1.default.existsSync(this.databasePath);
        if (!databaseExists) {
            node_fs_1.default.writeFileSync(this.databasePath, JSON.stringify([]));
        }
        this.loadData();
    }
    loadData() {
        const rawContent = JSON.parse(node_fs_1.default.readFileSync(this.databasePath, { encoding: 'utf-8' }));
        for (const item of rawContent) {
            if (!this.categories.has(item.id))
                this.categories.set(item.id, new Category_1.default(item.name, item.color, item.id));
        }
    }
    generateId() {
        if (!this.categories.size)
            return 1;
        const [biggestId] = Array.from(this.categories.values()).sort((a, b) => {
            if (a.id > b.id)
                return -1;
            if (a.id < b.id)
                return 1;
            return 0;
        });
        return biggestId.id + 1;
    }
    writeData() {
        const data = Array.from(this.categories.values());
        node_fs_1.default.writeFileSync(this.databasePath, JSON.stringify(data, null, 2));
    }
    fieldIsNotUnique(category, field) {
        const key = field;
        const data = Array.from(this.categories.values());
        if (!data.length)
            return false;
        return data.some((value) => {
            var _a;
            const isEqual = ((_a = value[key]) === null || _a === void 0 ? void 0 : _a.toString().localeCompare(category[key].toString(), 'pt-BR', { sensitivity: 'base' })) === 0;
            return isEqual && category.id !== value.id;
        });
    }
}
exports.default = CategoryJsonRepository;
