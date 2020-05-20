//Remember to Un-comment all the login stuff when other stuff done. 
import express from 'express';
import { User } from './models/User';
import { Application, Request, Response, NextFunction } from 'express';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { sessionMiddleware } from './middleware/sessionMiddleware';
import bodyParser from 'body-parser';
import { userRouter, findUserByLoginInfo } from './routers/userRouter';
import { myUsers, reimbursements } from './fake-data';
import { reimbursementRouter } from './routers/reimbursementRouter';
import { connectionPool } from './repository';
import { findReimbursmentByStatus } from './repository/user-data-access';
import { PoolClient, QueryResult } from "pg";

const app: Application = express();

//This applies to all endpoints.
app.use(bodyParser.json());

app.use(sessionMiddleware);

app.get('/views', (req: Request, res: Response) => {
    console.log(req.session);
    if(req.session && req.session.views) {
        req.session.views++;
        res.send(`Reached this endpoint ${req.session.views} times`);
      } else if(req.session) {
        req.session.views = 1;
        res.send('Reached the views endpoint for the first time');
      } else {
        res.send('Reached the views endpoint without a session')
    }
});

function execution() {
    console.log('Marks Expense Reimbursement System has started.');
}

execution();

//Users to log in with username and password
app.post('/login', (req: Request, res: Response) => {
    const {username, password} = req.body;
    if( !username || !password) {
        res.status(400).send('Please provide both a username and password');
    } else {
        try{
            const user = findUserByLoginInfo(username, password);
            if(req.session) {
                req.session.user = user;
            }
            res.json(user);
        } catch (e) {
            console.log(e.message);
            res.status(400).send('Invalid credentials');
        }
    }
});

// has /users endpoint with userRouter that gets all users
app.use('/users', userRouter);

// has /reimburesments endpoint with reimbursmentRouter that gets all users
app.use('/reimbursements', reimbursementRouter);

// NOT ACCESSIBLE! This endpoint needs some work. 
reimbursementRouter.get('/reimbursements/status/:statusId', (req: Request, res: Response) => {
    const {status} = req.body;
    res.json(findReimbursmentByStatus(status));
  });

app.listen(2400, () => {
  
    console.log("No errors! Hooray!!");
    
    connectionPool.connect().then(
      (client: PoolClient)=>{
        console.log('connected');
        
        client.query('SELECT * FROM reimbursements;').then(
          (result : QueryResult) => {
            console.log(result.rows[0]);
          }
        )
    }).catch((err)=>{
      console.error(err.message);
    })
  });
