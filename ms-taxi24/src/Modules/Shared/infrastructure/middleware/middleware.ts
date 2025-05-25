import { Request, Response, NextFunction } from 'express';

export function Middleware(req: Request, res: Response, next: NextFunction): void {
  console.log('middleware is running');
  next();
}
