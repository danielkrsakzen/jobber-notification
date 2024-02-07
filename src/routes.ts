import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router: Router = express.Router();

export const healthRoute = (): Router => {
  return router.get('/notification/health', (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('OK');
  });
};
