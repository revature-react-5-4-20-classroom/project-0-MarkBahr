import { User } from '../models/User';
import { users, reimbursements } from '../fake-data';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';
import { Reimbursement } from '../models/Reimbursement';
import { ReimbursementStatus } from '../models/ReimbursementStatus';
import { Role } from '../models/Role';
import { userRouter } from '../routers/userRouter';

export async function getAllReimbursements(): Promise<Reimbursement[]> {
    let client : PoolClient;
    client = await connectionPool.connect();
    try {
      let result : QueryResult;
      result = await client.query(
        `SELECT * FROM reimbursements;`
      );
      // result.rows contains objects that almost match our User objects.  Let's write a map()
      // that finishes the conversion
      //  for(let row of result.rows) {
        //console.log(row.reimbursementId);
      //}
      return result.rows.map((r) => {
        return new Reimbursement(r.id, r.author, r.amount, r.date_submitted, r.date_resolved, r.description, r.resolver, r.status, r.reimbursement_type);
      });
    } catch(e) {
      throw new Error(`Failed to query for all users: ${e.message}`);
    } finally {
      //as a reminder, finally always runs, regardless of success or failure.
      // One of the main uses of finally is to "clean up" whatever you were doing in try{}.
      // In our case, that means releasing our connection back into the pool:
      client && client.release();
    }
  }

  export async function addNewReimbursement(reimbursement: Reimbursement) : Promise<Reimbursement> {
    let client : PoolClient = await connectionPool.connect();
    try {
        const reimbursementIdResult : QueryResult = await client.query(
            `SELECT * FROM reimbursements WHERE reimbursment.reimbursement_type = $1`, [reimbursement.reimbursement_type]
        );
        
        // get the reimbursementId only
        const reimbursementId = reimbursementIdResult.rows[0].reimbursementId;
        
        // Add the rest of the information about the reimbursement
        let addReimbursementResult : QueryResult = await client.query(
            `INSERT INTO users (author, amount, date_submitted, date_resolved, description, resolver, status, type) VALUES
            ($1, $2, $3);`, [reimbursement.author, reimbursement.amount, reimbursement.date_submitted, reimbursement.date_resolved, reimbursement.description, reimbursement.resolver, reimbursement.status, reimbursement.reimbursement_type]
        )

        // Query the db for the new reimbursement
        let result : QueryResult = await client.query(
            `SELECT reimbursements.id, reimbursements.author, reimbursements.amount, reimbursements.date_submitted, reimbursements.date_resolved, reimbursements.desription, reimbursements.resolver, reimbursements.status, reimbursements.reimbursement_type
            FROM reimbursements INNER JOIN reimbursements ON reimbursements._id = roles.id
            WHERE users.username = $1;`, [reimbursement.author, reimbursement.amount, reimbursement.date_submitted, reimbursement.date_resolved, reimbursement.description, reimbursement.resolver, reimbursement.status, reimbursement.reimbursement_type]
        );

        return result.rows.map(
            (r)=>{return new Reimbursement(r.id, r.author, r.amount, r.date_submitted, r.date_resolved, r.description, r.resolver, r.status, r.reimbursement_type)}
        )[0];
    } catch (e) {
        throw new Error(`No new reimbursement was added to DB: ${e.message}`);
    } finally {
        client && client.release();
    }
}

// Find Reimbursement by Status
export async function findReimbursementByStatus(statusId: number) : Promise<Reimbursement[]> {
    let client : PoolClient;
    client = await connectionPool.connect();
    try{
        
        let result : QueryResult = await client.query(
            'SELECT * FROM reimbursements WHERE status = $1;', [statusId]
        )
        
        return result.rows.map(
           (r) => {return new Reimbursement(r.id, r.author, r.amount, r.date_submitted, r.date_resolved, r.description, r.resolver, r.status, r.reimbursement_type);
        });
    
    } catch (e) {
        throw new Error(`Failed to find status ${e.message}`);
    } finally {
        client && client.release();
    }
}

// UPDATE REIMBURSEMENT Goes w/ update reimbursement endpoint. Here we have to use the alter table alter column perhaps
export async function updateReimbursement(reimbursement: Reimbursement) : Promise<Reimbursement> {
    let client : PoolClient = await connectionPool.connect();
    console.log('abovetry');
    try{
            console.log(reimbursement);
            console.log('aboveIf');
        // Update the reimbursement with appropriate id
        if(reimbursement.id){
            console.log('insideIf1');
            if(reimbursement.author){
                await client.query('UPDATE reimbursements SET author = $1 WHERE id = $2;', [reimbursement.author, reimbursement.id]);
            } if(reimbursement.amount){
                console.log('not fail');
                await client.query('UPDATE reimbursements SET amount = $1 WHERE id = $2;', [reimbursement.amount, reimbursement.id]);
            } if(reimbursement.date_submitted){
                await client.query('UPDATE reimbursements SET date_submitted = $1 WHERE id = $2;', [reimbursement.date_submitted, reimbursement.id]);
            } if(reimbursement.date_resolved){
                await client.query('UPDATE reimbursements SET date_resolved = $1 WHERE id = $2;', [reimbursement.date_resolved, reimbursement.id]);
            } if(reimbursement.description){
                await client.query('UPDATE reimbursements SET description = $1 WHERE id = $2;', [reimbursement.description, reimbursement.id]);
            } if(reimbursement.resolver){
                await client.query('UPDATE reimbursements SET resolver = $1 WHERE id = $2;', [reimbursement.resolver, reimbursement.id]);
            } if(reimbursement.status){
                await client.query('UPDATE reimbursements SET status = $1 WHERE id = $2;', [reimbursement.status, reimbursement.id]);
            } if(reimbursement.reimbursement_type){
                await client.query('UPDATE reimbursements SET reimbursement_type = $1 WHERE id = $2;', [reimbursement.reimbursement_type, reimbursement.id]);
            }
        };
        
        // Get the reimbursement id for the reimbursement.
        let result : QueryResult = await client.query(
            'SELECT * FROM reimbursements WHERE id = $1', [reimbursement.id]
        );

        console.log('before Map');
        console.log(result.rows[0]);

        return result.rows.map(
            (r)=>{return new Reimbursement(r.id, r.author, r.amount, r.date_submitted, r.date_resolved, r.description, r.resolver, r.status, r.reimbursement_type)}
        )[0];
    
    } catch (e) {
        throw new Error(`Failed to find status ${e.message}`);
    }
    finally {
        client && client.release();
    }
}

// To find what reimbursements a user has authored:
export async function findReimbursementByUser(user : User) : Promise<Reimbursement> {
    try {
        let client : PoolClient = await connectionPool.connect();
        // Query to get an array of reimbursements made by taht user.
        let result : QueryResult = await client.query(
            `SELECT reimbursements.id, reimbursements.author, reimbursements.amount, reimbursements.date_submitted, reimbursements.date_resolved, reimbursements.description, reimbursements.resolver, reimbursements.status, reimbursements.reimbursement_type
            FROM reimbursements INNER JOIN users ON reimbursements.author = users.user_id
            WHERE user_id = $1;`, [user.user_id]
        );
        const reimbursment = result.rows.map((r) => {
            return new Reimbursement(r.id, r.author, r.amount, r.date_submitted, r.date_resolved, r.description, r.resolver, r.status, r.reimbursement_type);
            });
        if(reimbursment.length > 0) {
          return reimbursment[0];
        } else {
          throw new Error('User not matched by any reimbursement');
        } 
    } catch(e) {
            throw new Error(`Failed to find user ${e.message}`);
    } 
}