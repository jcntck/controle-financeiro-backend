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
const node_process_1 = __importDefault(require("node:process"));
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = __importDefault(require("fs"));
const CategoryJsonRepository_1 = __importDefault(require("../../src/repository/CategoryJsonRepository"));
const Category_1 = __importDefault(require("../../src/core/entity/Category"));
let categoryRepository;
const databasePath = node_path_1.default.resolve(node_process_1.default.cwd(), 'data', 'categories-test.json');
const categoriesToCreate = [
    { name: 'Casa', color: 'blue' },
    { name: 'Academia', color: 'red' },
    { name: 'Lazer', color: 'orange' },
    { name: 'Educação', color: 'purple' },
];
beforeAll(() => {
    categoryRepository = new CategoryJsonRepository_1.default(databasePath);
});
afterAll(() => {
    const databaseExists = fs_1.default.existsSync(databasePath);
    if (databaseExists) {
        fs_1.default.unlinkSync(databasePath);
    }
});
test.each(categoriesToCreate)('Should create each category successfully', ({ name, color }) => __awaiter(void 0, void 0, void 0, function* () {
    const id = yield categoryRepository.save(new Category_1.default(name, color));
    const category = yield categoryRepository.getById(id);
    expect(category).toEqual({
        id,
        name,
        color,
    });
}));
it('Should edit a category successfully', () => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categoryRepository.getById(1);
    const categoryToUpdate = new Category_1.default(category.name, '#bf2640', category.id);
    yield categoryRepository.save(categoryToUpdate);
    const categoryUpdated = yield categoryRepository.getById(1);
    expect(categoryUpdated).toEqual({
        id: 1,
        name: 'Casa',
        color: '#bf2640',
    });
}));
it('Should delete a category succesfully', () => __awaiter(void 0, void 0, void 0, function* () {
    const countBeforeDelete = yield categoryRepository.count();
    yield categoryRepository.delete(1);
    const countAfterDelete = yield categoryRepository.count();
    expect(countAfterDelete).toBe(countBeforeDelete - 1);
}));
it('Should create a category succesfully after delete one with id correct', () => __awaiter(void 0, void 0, void 0, function* () {
    const id = yield categoryRepository.save(new Category_1.default('Casa', 'blue'));
    const category = yield categoryRepository.getById(id);
    expect(category).toEqual({
        id: 5,
        name: 'Casa',
        color: 'blue',
    });
}));
it('Should return null if category not exists', () => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield categoryRepository.getById(-1);
    expect(category).toBeNull();
}));
it('Should return an list of categories', () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield categoryRepository.getAll();
    expect(categories).toBeInstanceOf(Array);
}));
