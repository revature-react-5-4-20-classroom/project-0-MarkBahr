import express, { Router, Request, Response, NextFunction } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { reimbursements } from '../fake-data';
import { addNewReimbursement, findReimbursementByStatus, getAllReimbursements, updateReimbursement, findReimbursementByUser } from '../repository/reimbursement-data-access';
// import { authAdminMiddleware } from '../middleware/authMiddleware';
import { ReimbursementStatus } from '../models/ReimbursementStatus';
import { User } from '../models/User';

export const reimbursementRouter : Router = express.Router();

reimbursementRouter.use((req: Request, res: Response, next: NextFunction) => {
  if(req.method === 'POST'){
    next();
  }else if(req.session && req.session.user.role == 1) {
    next();
  } else if(req.session && +req.params.userId === req.session.users.user_id){
    next();
  } else {
    res.status(401).send('The incoming token has expired');
  }
}) 

//  constructor(id:number, author:number, amount:number, date_submitted:Date, date_resolved:Date, description:string, resolver:number, status:number, reimbursement_type:number){
// Submit Reimbursement Endpoint (the corresponding addNewReimbursment function is in user-data-access)
reimbursementRouter.post('/', async (req: Request, res: Response) => {
  let {id, author, amount, date_submitted, date_resolved, description, resolver, status, reimbursement_type} = req.body;
  // Make sure we have received the correct fields
  if((id === 0) && author && amount && date_submitted && date_resolved && description && resolver && status && reimbursement_type) {
    const reimbursement : Reimbursement = await addNewReimbursement(new Reimbursement(id, author, amount, date_submitted, date_resolved, description, resolver, status, reimbursement_type))
    res.sendStatus(201).json(reimbursement);
  } else {
    // response status for not entering all the required information
    res.status(400).send('Please include all required reimbursement fields.');
  }
});

//Update reimbursement endpoint 
reimbursementRouter.patch('/', async function(req: Request, res: Response){
  let {id, author, amount, date_submitted, date_resolved, description, resolver, status, reimbursement_type} = req.body;
  let columns = req.body;
  if(id & author | amount | date_submitted | date_resolved | description | resolver | status | reimbursement_type){
    console.log('place1');
    await updateReimbursement(columns)
      .then((reimbursement: Reimbursement) => {
        console.log(reimbursement);
        res.status(201).json(reimbursement);
      })
      .catch((e: Error) => {
        console.log(e.message);
        res.status(400);
      })
    console.log("Im here");
    
  } else {
  res.status(400).send('No reimbursement fields were updated');
  }
});

reimbursementRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
  // get all users, using async/await
  const reimbursements : Reimbursement[] = await getAllReimbursements();
  res.json(reimbursements);
  } catch (e) {
    next(e);
  }
});

// NOT ACCESSIBLE! This endpoint needs some work. 
reimbursementRouter.get('/status/:statusId', async (req: Request, res: Response, next: NextFunction) => {
  const statusId = +req.params.statusId;
  findReimbursementByStatus(statusId)
  .then((reimbursement: Reimbursement[]) => {
    console.log(reimbursement);
    res.status(201).json(reimbursement);
  })
  .catch((e: Error) => {
    console.log(e.message);
    res.status(400);
  })

});

//Find reimbursement by user
// Keep the parameter named userId, it's required by the middleware. 
reimbursementRouter.get('/author/userId/:userId', async function(req: Request, res: Response, next: NextFunction) {
    const userId = +req.params.userId;
    findReimbursementByUser(userId)
    .then((reimbursement: Reimbursement[]) => {
      console.log(reimbursement);
      res.status(201).json(reimbursement);
    })
    .catch((e: Error) => {
      console.log(e.message);
      res.status(400);
    })  
});

