import { User } from '../models/User';
import { myUsers, reimbursements } from '../fake-data';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';
import { Reimbursement } from '../models/Reimbursement';
import { ReimbursementStatus } from '../models/ReimbursementStatus';
import { Role } from '../models/Role';
import { userRouter } from '../routers/userRouter';


// This function will need to be changed to return just one user. 
export async function getAllUsers(): Promise<User[]> {
    let client : PoolClient;
    client = await connectionPool.connect();
    try{
        let result : QueryResult;
        result = await client.query(
            `SELECT users.user_id, users.username, users."password", users.first_name, users.last_name, users.email, users.role
            FROM users INNER JOIN roles ON users."role" = roles.role_id;`
        );
        for(let row of result.rows) {
            console.log(row.username)
        }
        return result.rows.map((u) => {
            return new User(u.userId, u.username, u.password, u.firstName, u.lastName, u.email, u.role);
        });
    } catch(e) {
        throw new Error(`Query for all users failed: ${e.message}`);
    } finally {
        client && client.release();
    }
}

export function getUserById(id: number) : User {
    return myUsers.filter((user)=>{return user.userId === id;})[0];
}

export async function addNewReimbursement(reimbursement: Reimbursement) : Promise<Reimbursement> {
    let client : PoolClient = await connectionPool.connect();
    try {
        const reimbursementIdResult : QueryResult = await client.query(
            `SELECT * FROM reimbursements WHERE reimbursment.reimbursement_type = $1`, [reimbursement.type]
        );
        
        // get the reimbursementId only
        const reimbursementId = reimbursementIdResult.rows[0].reimbursementId;
        
        // Add the rest of the information about the reimbursement
        let addReimbursementResult : QueryResult = await client.query(
            `INSERT INTO users (author, amount, date_submitted, date_resolved, description, resolver, status, type) VALUES
            ($1, $2, $3);`, [reimbursement.author, reimbursement.amount, reimbursement.dateSubmitted, reimbursement.dateResolved, reimbursement.description, reimbursement.resolver, reimbursement.status, reimbursement.type]
        )

        // Query the db for the new reimbursement
        let result : QueryResult = await client.query(
            `SELECT reimbursements.id, reimbursements.author, reimbursements.amount, reimbursements.date_submitted, reimbursements.date_resolved, reimbursements.desription, reimbursements.resolver, reimbursements.status, reimbursements.reimbursement_type
            FROM reimbursements INNER JOIN reimbursements ON reimbursements._id = roles.id
            WHERE users.username = $1;`, [reimbursement.author, reimbursement.amount, reimbursement.dateSubmitted, reimbursement.dateResolved, reimbursement.description, reimbursement.resolver, reimbursement.status, reimbursement.type]
        );

        return result.rows.map(
            (r)=>{return new Reimbursement(r.reimbursementId, r.author, r.amount, r.dateSubmitted, r.dateResolved, r.description, r.resolver, r.status, r.type)}
        )[0];
    } catch (e) {
        throw new Error(`No new reimbursement was added to DB: ${e.message}`);
    } finally {
        client && client.release();
    }
}

/*
// ERRORS HERE!! Would the following work with this function: result.command: string
export async function updateUser(user: User) :Promise<User> {
    let client : PoolClient = await connectionPool.connect();
    try{
        const roleIdResult : QueryResult = await client.query(
            `SELECT * FROM roles WHERE roles."role" = $1`, [user.role]
        );
        const roleId = roleIdResult.rows[0].userId;

        let insertUserResult : QueryResult = await client.query(   
            `UPDATE users (username, "password", first_name, last_name, email, "role")
            ($1, $2, $3, $4, $5, $6);` [user.username, user.password, user.firstName, user.lastName, user.email, user.role]
        );  // Figure out what's wrong here with "Role can't be an index type."

        let result : QueryResult = await client.query(
            `SELECT users.id, users.username, users.password, users.first_name, users.last_name, users.email, users."role"
            FROM users INNER JOIN roles ON users.role = roles.role_id
            WHERE users.username = $1;` [user.userId]
        );

        return result.rows.map(
            (u)=>{return new User(u.userId, u.username, u.password, u.firstName, u.lastName, u.email, u.role)}
        )[0];
    } catch (e) {
        throw new Error(`Failed to add use to DB: ${e.message}`);
    } finally {
        client && client.release();
    }
}
*/

// Find Reimbursement by Status
export async function findReimbursmentByStatus(reimburesments: Reimbursement) : Promise<Reimbursement> {
    let client : PoolClient;
    client = await connectionPool.connect();
    try{
        let result : QueryResult;

        result = await client.query(
            `SELECT reimbursements.id, reimbursements.author, reimbursements.amount, reimbursements.date_submitted, reimbursements.date_resolved, reimbursements.description, reimbursements.resolver, reimbursements.status, reimbursements.reimbursement_type
            FROM reimbursements INNER JOIN reimbursement_status ON reimbursements.status = reimbursement_status.status_id
            WHERE reimbursements.status = $1;`, [status]
        );
        const reimbMatchStatus = result.rows.map((r) => {
            return new Reimbursement(r.reimbursementId, r.author, r.amount, r.dateSubmitted, r.dateResolved, r.description, r.resolver, r.status, r.type);
        });
        if(reimbMatchStatus.length > 0) {
            return reimbMatchStatus[0];
        } else {
            throw new Error('Status not matched by any reimbursement');
        }
    } catch (e) {
        throw new Error(`Failed to find status ${e.message}`);
    } finally {
        client && client.release();
    }
}



// UPDATE REIMBURSEMENT Goes w/ update reimbursement endpoint. Here we have to use the alter table alter column perhaps
export async function updateReimbursement(reimbursement: Reimbursement) : Promise<Reimbursement> {
    let client : PoolClient = await connectionPool.connect();
    let column_name : any;
    try{
        if(reimbursement.reimbursementId != undefined){
            if(reimbursement.author !== undefined){
                let updateAuthor = await client.query('UPDATE reimbursement SET author=$1 WHERE reimbursementId=$2', [reimbursement.author, reimbursement.reimbursementId]);
            } if(reimbursement.amount !== undefined){
                    let updateAmount = await client.query('UPDATE reimbursement SET author=$1 WHERE reimbursementId=$2', [reimbursement.amount, reimbursement.reimbursementId]);
            } if(reimbursement.dateSubmitted !== undefined){
                let updateDateSub = await client.query('UPDATE reimbursement SET author=$1 WHERE reimbursementId=$2', [reimbursement.dateSubmitted, reimbursement.reimbursementId]);
            } if(reimbursement.dateResolved !== undefined){
                let updateDateRes = await client.query('UPDATE reimbursement SET author=$1 WHERE reimbursementId=$2', [reimbursement.dateResolved, reimbursement.reimbursementId]);
            } if(reimbursement.description !== undefined){
                let updateDescript = await client.query('UPDATE reimbursement SET author=$1 WHERE reimbursementId=$2', [reimbursement.description, reimbursement.reimbursementId]);
            } if(reimbursement.resolver !== undefined){
                let updateResolver = await client.query('UPDATE reimbursement SET author=$1 WHERE reimbursementId=$2', [reimbursement.resolver, reimbursement.reimbursementId]);
            } if(reimbursement.status !== undefined){
                let updateAmount = await client.query('UPDATE reimbursement SET author=$1 WHERE reimbursementId=$2', [reimbursement.status, reimbursement.reimbursementId]);
            } if(reimbursement.type !== undefined){
                let updateType = await client.query('UPDATE reimbursement SET author=$1 WHERE reimbursementId=$2', [reimbursement.type, reimbursement.reimbursementId]);
            }
        };
    }  
    finally {
        (r: Reimbursement)=>{return new Reimbursement(r.reimbursementId, r.author, r.amount, r.dateSubmitted, r.dateResolved, r.description, r.resolver, r.status, r.type)};
    }
    return reimbursement;
}

/*
// REIMB BY USER: Find reimbursements by user. We need SQL 
export async function findReimbursmentByUser(user: User) : Promise<Reimbursement> {
    let client : PoolClient = await connectionPool.connect();
    return result.rows.map(
        (r)=>{return new Reimbursement(r.reimbursementId, r.author, r.amount, r.dateSubmitted, r.dateResolved, r.description, r.resolver, r.status, r.type)}
    )[0];
}

// Reibursement STATUS

*/

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
      for(let row of result.rows) {
        console.log(row.reimbursementId);
      }
      return result.rows.map((r) => {
        return new Reimbursement(r.reimbursementId, r.author, r.amount, r.dateSubmitted, r.dateResolved, r.description, r.resolver, r.status, r.type);
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