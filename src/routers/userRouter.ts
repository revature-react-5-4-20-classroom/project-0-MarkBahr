import express, { Router, Request, Response, NextFunction } from "express";
import { User } from '../models/User';
// import { roleFactory } from '../middleware/authMiddleware';
import { users, reimbursements} from '../fake-data';
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from "../repository";
import { getAllUsers, getUserById, updateUser } from '../repository/user-data-access';
import { Role } from '../models/Role';
import { reimbursementRouter } from "./reimbursementRouter";
//add import of addNewUser to the line above

export const userRouter: Router = express.Router();

// userRouter.use(roleFactory);

// - - - - - - - - - - -- - 
// This project needs this to return just one user though
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users : User[] = await getAllUsers();
        res.json(users);
    } catch (e) {
        next(e);
    }
});

// I have to remember that whatever comes after the / in the url will come after users in the index.ts
userRouter.get('/:user_id', (req: Request, res: Response) => {
    const id = +req.params.id;
    if(isNaN(id)) {
      res.status(400).send('Must include numeric id in path');
    } else {
      res.json(getUserById(id));
    }
  });


//Update reimbursement endpoint 
userRouter.patch('/', async function(req: Request, res: Response){
  let {user_id, username, password, first_name, last_name, email, role} = req.body;
  let columns = req.body;
  if(user_id & username | password | first_name | last_name | email | role){
    await updateUser(columns);
    res.sendStatus(201);
  } else {
  res.status(400).send('No user fields were updated');
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

