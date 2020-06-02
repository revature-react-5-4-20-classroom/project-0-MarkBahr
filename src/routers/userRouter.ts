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

userRouter.use((req: Request, res: Response, next: NextFunction) => {
  if((req.method === 'GET') && (req.session && req.session.user.role == 1)){
    next();
  } else if((req.method === 'PATCH') && (req.session && req.session.user.role == 2)){
    next();
  } else if(req.session && +req.params.userId === req.session.user.user_id){
    next();
  } else {
    res.status(401).send('The incoming token has expired');
  }
});

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
userRouter.get('/:userId', async (req: Request, res: Response) => {
    const id = +req.params.userId;
    if(isNaN(id)) {
      res.status(400).send('Must include numeric id in path');
    } else {
      res.json(await getUserById(id));
    }
});


//Update reimbursement endpoint 
userRouter.patch('/', async function(req: Request, res: Response){
  let {user_id, username, password, first_name, last_name, email, role} = req.body;
  let columns = req.body;
  console.log('above if user');
  if(user_id && username || password || first_name || last_name || email || role){
    console.log('inside if user');
    await updateUser(columns)
    .then((user: User) => {
      console.log(user);
    res.sendStatus(201).json(user);
    })
    .catch((e: Error) => {
      console.log(e.message);
      res.status(400);
    })
  } else {
  res.status(400).send('No user fields were updated');
  }
});
