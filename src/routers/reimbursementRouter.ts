import express, { Router, Request, Response, NextFunction } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { reimbursements } from '../fake-data';
import { addNewReimbursement, findReimbursementByStatus, getAllReimbursements, updateReimbursement, findReimbursementByUser } from '../repository/reimbursement-data-access';
//import {authReadOnlyMiddleware} from '../middleware/authMiddleware';
import { ReimbursementStatus } from '../models/ReimbursementStatus';
import { User } from '../models/User';

export const reimbursementRouter : Router = express.Router();

 // reimbursementRouter.use(authReadOnlyMiddleware);
/*
//This will have to use a different function to get status. Add: /status/:statusId
// Whenever you have a query to the database, you have to use a query. 
reimbursementRouter.get('/', (req:Request, res:Response) => {
    let async : Reimbursement =  reimbursements
    res.json(getAllReimbursements(reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type)); // call our function because we're separating concerns
  });
*/
//  constructor(id:number, author:number, amount:number, date_submitted:Date, date_resolved:Date, description:string, resolver:number, status:number, reimbursement_type:number){
// Submit Reimbursement Endpoint (the corresponding addNewReimbursment function is in user-data-access)
reimbursementRouter.post('/', (req: Request, res: Response) => {
  let {id, author, amount, date_submitted, date_resolved, description, resolver, status, reimbursement_type} = req.body;
  // Make sure we have received the correct fields
  if(id && author && amount && date_submitted && date_resolved && description && resolver && status && reimbursement_type) {
    addNewReimbursement(new Reimbursement(id, author, amount, date_submitted, date_resolved, description, resolver, status, reimbursement_type));
    res.sendStatus(201);
  } else {
    // response status for not entering all the required information
    res.status(400).send('Please include all required reimbursement fields.');
  }
});

//Update reimbursement endpoint 
reimbursementRouter.patch('/', async function(req: Request, res: Response){
  let {id, author, amount, date_submitted, date_resolved, description, resolver, status, reimbursement_type} = req.body;
  let columns = req.body;
  if(id &author | amount | date_submitted | date_resolved | description | resolver | status | reimbursement_type){
    await updateReimbursement(columns);
    res.sendStatus(201);
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
  try {
    let status1 = new ReimbursementStatus(1, 'Submitted to Finance Manager');
  const reimbursement : Reimbursement = await findReimbursementByStatus(status1);
  res.json(reimbursement);
  } catch(e){
    next(e);
  }

});

//Find reimbursement by user
reimbursementRouter.get('/author/userId/:userId', async function(req: Request, res: Response, next: NextFunction) {
  try{
    let user1 = new User(12, 'cGreen', '246password', 'Cameron', "Green", 'cgreen89@gmail.com', 'Finance Manager');
    const reimbursement : Reimbursement = await findReimbursementByUser(user1);
    res.json(reimbursement);
  } catch(e){
      next(e);
  } 
});

