import DebitTransactionController from '../controller/DebitTransactionController';
import HttpAdapter from '../core/adapters/HttpAdapter';

export default class DebitTransactionRoutes {
  constructor(readonly httpAdapter: HttpAdapter, readonly debitTransactionController: DebitTransactionController) {
    this.httpAdapter.on('post', '/api/v1/debit-transactions', async (params: any, body: any) => {
      const response = await this.debitTransactionController.post(body);
      return {
        response,
        status: 201,
      };
    });
    this.httpAdapter.on('get', '/api/v1/debit-transactions', async (params: any, body: any, query: any) => {
      const response = await this.debitTransactionController.get(query);
      return {
        response,
      };
    });
    this.httpAdapter.on('get', '/api/v1/debit-transactions/external', async (params: any, body: any, query: any) => {
      const response = await this.debitTransactionController.getAllByExternalIds(query);
      return {
        response,
      };
    });
    this.httpAdapter.on('get', '/api/v1/debit-transactions/:id', async (params: any, body: any) => {
      const response = await this.debitTransactionController.getById(params.id);
      return {
        response,
      };
    });
    this.httpAdapter.on('get', '/api/v1/debit-transactions/external/:external_id', async (params: any, body: any) => {
      const response = await this.debitTransactionController.getByExternalId(params.external_id);
      return {
        response,
      };
    });
    this.httpAdapter.on('put', '/api/v1/debit-transactions/:id', async (params: any, body: any) => {
      await this.debitTransactionController.put(params.id, body);
      return {
        response: null,
        status: 204,
      };
    });
    this.httpAdapter.on('delete', '/api/v1/debit-transactions/:id', async (params: any, body: any) => {
      const response = await this.debitTransactionController.delete(params.id);
      return {
        response: null,
        status: 204,
      };
    });
  }
}
