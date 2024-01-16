import HttpAdapter from '../core/adapters/HttpAdapter';
import express, { Request, Response } from 'express';
import cors from 'cors';

export default class ExpressAdapter implements HttpAdapter {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method](url, async function (req: Request, res: Response) {
      try {
        const { response, status = 200 } = await callback(req.params, req.body, req.query);
        res.status(status).json(response);
      } catch (error: any) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
    });
  }

  listen(port: number): void {
    this.app.listen(port, () => console.log('server running at port ' + port));
  }
}
