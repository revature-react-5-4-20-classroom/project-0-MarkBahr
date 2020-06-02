//Remember to Un-comment all the login stuff when other stuff done. 
import express from 'express';
import { User } from './models/User';
import { Application, Request, Response, NextFunction } from 'express';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { sessionMiddleware } from './middleware/sessionMiddleware';
import bodyParser from 'body-parser';
import { userRouter } from './routers/userRouter';
import { users, reimbursements } from './fake-data';
import { reimbursementRouter } from './routers/reimbursementRouter';
import { connectionPool } from './repository';
import { findUserByLoginInfo } from './repository/user-data-access';
import { findReimbursementByStatus } from './repository/reimbursement-data-access';
import { PoolClient, QueryResult } from "pg";
import { corsFilter } from './middleware/corsFilter';

const app: Application = express();

// Check if webhook works by pushing new endpoint
app.get('/new-endpoint', (req: Request, res: Response) =>{
  res.send('Webhoodks worked!');
})

app.use(corsFilter);

//This applies to all endpoints.
app.use(bodyParser.json());

app.use(sessionMiddleware);

app.use(loggingMiddleware);

function execution() {
    console.log('Marks Expense Reimbursement System has started.');
}

execution();

//Users to log in with username and password
app.post('/login', async (req: Request, res: Response) => {
    const {username, password} = req.body;
    if( !username || !password) {
        res.status(400).send('Please provide both a username and password');
    } else {
        try{
            const user = await findUserByLoginInfo(username, password);
            console.log(user);
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
