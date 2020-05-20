import express, { Router, Request, Response, NextFunction } from 'express';
import { Reimbursement } from '../models/Reimbursement';
import { reimbursements } from '../fake-data';
import { addNewReimbursement, findReimbursmentByStatus, getAllReimbursements, updateReimbursement } from '../repository/user-data-access';
import {authReadOnlyMiddleware} from '../middleware/authMiddleware';

export const reimbursementRouter : Router = express.Router();


reimbursementRouter.use(authReadOnlyMiddleware);
/*
//This will have to use a different function to get status. Add: /status/:statusId
// Whenever you have a query to the database, you have to use a query. 
reimbursementRouter.get('/', (req:Request, res:Response) => {
    let async : Reimbursement =  reimbursements
    res.json(getAllReimbursements(reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type)); // call our function because we're separating concerns
  });
*/

// Submit Reimbursement Endpoint (the corresponding addNewReimbursment function is in user-data-access)
reimbursementRouter.post('/', (req: Request, res: Response) => {
  let {reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type} = req.body;
  // Make sure we have received the correct fields
  if(reimbursementId && author && amount && dateSubmitted && dateResolved && description && resolver && status && type) {
    addNewReimbursement(new Reimbursement(reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type));
    res.sendStatus(201);
  } else {
    // response status for not entering all the required information
    res.status(400).send('Please include all required reimbursement fields.');
  }
});

//Update reimbursement endpoint 
reimbursementRouter.patch('/', async function(req: Request, res: Response){
  let {reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type} = req.body;
  let columns = req.body;
  if(reimbursementId |author | amount | dateSubmitted | dateResolved | description | resolver | status | type){
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


