import express, {Request, Response, NextFunction, request, response} from 'express';
import { Role, } from '../models/Role';

export const authAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // if no session or no user on that session
    if(!req.session || !req.session.user) {
      res.status(401).send('Please login');
    } else if (req.session.user.role !== 'Admin') {
      res.status(403).send('You are not authorized');
    } else {
      next();
    }
}

export let finManage = new Role(1, 'Finance Manager');
export let admin = new Role(2, 'Administrator');
export let someUser = new Role(3, 'User');
export let guest = new Role(4, 'Guest');

export function roleFactory(roles : Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.session || !req.session.user) {
            res.status(401).send('Please login');
        } else {
            let allowed = false;
            for(let role of roles) {
                if(req.session.user === role) {
                    allowed = true;
                }
            }
            if(allowed) {
                next();
            } else {
                response.status(403).send(`Not authorized with role: ${req.session.user.role}`);
            }
        }
    }
}

// let GET requests in from anyone, let POST/other requests in if the user is logged in
export const authReadOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(req.method === 'GET') {
      next();
    } else if(!req.session || !req.session.user) {
      res.status(401).send(`Cannot ${req.method} unless you first login`);
    } else {
      next();
    }
  }