import express from 'express';
import bodyParser from 'body-parser'; // parses it as json, its a bodyparser. 
import { User } from './models/User'; // from this directory
// import { Role } from './models/Role';
import { Reimbursement } from './models/Reimbursement'; // from this directory
// import { ReimbursementStatus } from './models/ReimbursementStatus';
// import { ReimbursementType } from './models/ReimbursementType';

import {Application, Request, Response} from 'express'; // Start like this for non-default
import { users, reimbursements } from './fake-data';

const app : Application = express();

app.use(bodyParser.json());

app.listen(2800, () => {
    console.log("expense tracker has started");
});


app.get('/users', (req:Request, res:Response) => {
    res.json(getAllUsers());
});


app.get('users/:id', (req:Request, res:Response) => {
    const id = +req.params.id;
    if(isNaN(id)) {
        res.status(400).send('ID must be a number');
    } else {
        res.json(getUserById(id));
    }
});



/* Figure out how to do patch and update before finishing this one
app.patch('/users', (req: Request, res: Response) => {
    let {userId, username, password, firstName, lastName, email, role} = req.body;
    if(userId && username && password && firstName && lastName && email && role) {
        updateUser(new User(userId, username, password, firstName, lastName, email, role));
        res.sendStatus(2)
    }
});
*/


// login
app.post('/login', (req:Request, res:Response) => {
    let {username, password} = req.body;
    if(this.username === username && this.password === password) {
        res.sendStatus(200);
    } else {
        res.status(400).send('Username and/or password incorrect.');
    }
});

// Req username & string, res: user, error response 400 "invalid credentials"
app.post('/login', (req: Request, res: Response) => {
    let {}
    
})

// Use path parameter to get by id using :param
app.get('/users/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    if(isNaN(id)) {
        res.status(400).send('Must include numeric id in path');
    } else {
        res.json(getUsersById(id));
    }
})

// Function to enable Admin to access all users.
function getAllUsers(): User[] {
    return users;
}


// Function to return a specific user.
function getUserById(id: number) : User {
    return users.filter((user)=>{return users.id === id;})[0];
} 

// goes with above app.get to get user by id
function getUsersById(id: number): User {
    return users.filter((user) => {
        return user.id === id;
    })[0];
}



// Start with reimbursements -------------------------------

app.get('/reimbursements', (req: Request, res: Response) => {
    res.json(getAllReimbursements);
})

// Function to enable Admin to access all users.
function getAllReimbursements(): Reimbursement[] {
    return reimbursements;
}
