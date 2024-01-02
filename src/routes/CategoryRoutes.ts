import CategoryController from '../controller/CategoryController';
import HttpAdapter from '../core/adapters/HttpAdapter';
import ValidationError from '../helpers/ValidationError';

export default class CategoryRoutes {
  constructor(readonly httpAdapter: HttpAdapter, readonly categoryController: CategoryController) {
    this.httpAdapter.on('get', '/api/v1/categories', async (params: any, body: any) => {
      const categories = await this.categoryController.get();
      return {
        response: categories,
      };
    });
    this.httpAdapter.on('get', '/api/v1/categories/:id', async (params: any, body: any) => {
      const category = await this.categoryController.getById(params.id);
      return { response: category };
    });
    this.httpAdapter.on('post', '/api/v1/categories', async (params: any, body: any) => {
      const response = await this.categoryController.post(body);
      return {
        response,
        status: 201,
      };
    });
    this.httpAdapter.on('put', '/api/v1/categories/:id', async (params: any, body: any) => {
      await this.categoryController.put(params.id, body);
      return {
        response: null,
        status: 204,
      };
    });
    this.httpAdapter.on('delete', '/api/v1/categories/:id', async (params: any, body: any) => {
      await this.categoryController.delete(params.id);
      return {
        response: null,
        status: 204,
      };
    });
  }
}
