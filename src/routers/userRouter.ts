import express, { Router, Request, Response, NextFunction } from "express";
import { User } from '../models/User';
import { roleFactory, finManage, admin, someUser, guest } from '../middleware/authMiddleware';
import { myUsers, reimbursements} from '../fake-data';
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from "../repository";
import { getAllUsers } from '../repository/user-data-access';
import { Role } from '../models/Role';
// add import of addNewUser to the line above

export const userRouter: Router = express.Router();


userRouter.use(roleFactory([finManage, admin, someUser, guest]));

// - - - - - - - - - - -- - 
// This project needs this to return just one user though
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myUsers : User[] = await getAllUsers();
        res.json(myUsers);
    } catch (e) {
        next(e);
    }
});

/*
userRouter.post('/', async (req: Request, res: Response) => {
    let {userId, username, password, firstName, lastName, email, role} = req.body;
    if(userId && username && password && firstName && lastName && email && role) {
      await addNewUser(new User(userId, username, password, firstName, lastName, email, role));
      res.sendStatus(201);
    } else {
      res.status(400).send('Please include required fields.');
    }
  });
  

// - - - - - - - - - - -
*/

// for the login Endpoint, returns a User if username & password entered correctly
export function findUserByLoginInfo(username: string, password: string) : User {
    const usersMatchUsernamePassword = myUsers.filter(
        (u)=>{return u.username === username && u.password === password}
    );
    if(usersMatchUsernamePassword.length > 0) {
        return usersMatchUsernamePassword[0];
        console.log('Login successful!');
    } else {
        throw new Error('You must use both a username & a password');
    }
}