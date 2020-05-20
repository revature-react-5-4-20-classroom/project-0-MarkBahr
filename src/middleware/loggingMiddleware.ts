import { Request, Response, NextFunction } from "express";

// We'll start by writing custom logging middleware
export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  // all of the callbacks we write with either app.use or app.get, etc. need to
  // call next() or call a method on res.  In middleware, we call next.
  console.log(`Request received to url: ${req.url} with method: ${req.method}`);
  next();
}