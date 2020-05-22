import { User } from '../models/User';
import { users, reimbursements } from '../fake-data';
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
            `SELECT * FROM users;`
        );
        for(let row of result.rows) {
            console.log(row.user_id)
        }
        return result.rows.map((u) => {
            return new User(u.user_id, u.username, u.password, u.first_name, u.last_name, u.email, u.role);
        });
    } catch(e) {
        throw new Error(`Query for all users failed: ${e.message}`);
    } finally {
        client && client.release();
    }
}

export async function getUserById(id: number) : Promise<User> {
    let client : PoolClient = await connectionPool.connect();
    try{
        let result : QueryResult;
        result = await client.query(
            `SELECT * FROM users 
            WHERE users.user_id = $1`, [id]
        );
        const userMatchId = result.rows.map((u) => {
            return new User(u.user_id, u.username, u.password, u.first_name, u.last_name, u.email, u.role);
          });
            if(userMatchId) {
                return users.filter((user)=>{return user.user_id === id;})[0];
            } else {
                throw new Error('Invalid ID');
            }
    }catch (e) {
        throw new Error(`Failed to validate User with DB: ${e.message}`);
    } finally {
        client && client.release();
    }      
}

export async function findUserByLoginInfo(username: string, password: string) : Promise<User> {
    let client : PoolClient;
    client = await connectionPool.connect();
    try {
      let result : QueryResult;
      // above, when retrieving all users, we used a plain old string for our SQL query
      // Using a string is fine provided you never do string concatenation or template literals
      // -- provided you don't produce the string programmatically.
      // If we're producing the string programmatically, then we open ourselves up to SQL Injection
      // SQL Injection is when somehow the user is able to cause unintended SQL queries to be run.
      // We need to be worried about someone attempting to login with the username ';DROP TABLE users'
  
      // To solve this, we have parameterized queries, where we send a query and the values we want
      // to plug into it together to the database, and the database prevents anything fishy from happening.
      // This will replace the $1 and $2 with username and password respectively:
      result = await client.query(
        `SELECT users.user_id, users.username, users.password, users.first_name, users.last_name, users.email, users.role
        FROM users INNER JOIN roles ON users.role = roles.role_id
        WHERE users.username = $1 AND users.password = $2;`, [username, password]
      );
      const usersMatchingUsernamePassword = result.rows.map((u) => {
        return new User(u.id, u.username, u.password, u.first_name, u.last_name, u.email, u.role);
      })
      if(usersMatchingUsernamePassword.length > 0) {
        return usersMatchingUsernamePassword[0];
      } else {
        throw new Error('Invalid user');
      }
    } catch (e) {
      throw new Error(`Failed to validate User with DB: ${e.message}`);
    } finally {
      client && client.release();
    }  
  }


// ERRORS HERE!! Would the following work with this function: result.command: string
export async function updateUser(user: User) :Promise<User> {
    let client : PoolClient = await connectionPool.connect();
    try{
        const userIdResult : QueryResult = await client.query(
            `SELECT user_id FROM users WHERE user_id = $1`, [user.user_id]
        );
 
            // Update the reimbursement with appropriate id
        if(user.user_id !== undefined){
            if(user.username !== undefined){
                let updateUsername = await client.query('UPDATE users SET username=$1 WHERE user_id=$2', [user.username, user.user_id]);
            } if(user.password !== undefined){
                    let updatePassword = await client.query('UPDATE users SET password=$1 WHERE user_id=$2', [user.password, user.user_id]);
            } if(user.first_name !== undefined){
                let updateFirstName = await client.query('UPDATE users SET first_name=$1 WHERE user_id=$2', [user.first_name, user.user_id]);
            } if(user.last_name !== undefined){
                let updateLastName = await client.query('UPDATE users SET last_name=$1 WHERE user_id=$2', [user.last_name, user.user_id]);
            } if(user.email !== undefined){
                let updateEmail = await client.query('UPDATE users SET email=$1 WHERE user_id=$2', [user.email, user.user_id]);
            } if(user.role !== undefined){
                let updateRole = await client.query('UPDATE users SET role=$1 WHERE user_id=$2', [user.role, user.user_id]);
            }
        };

        return userIdResult.rows.map((u) => {
            return new User(u.userId, u.username, u.password, u.firstName, u.lastName, u.email, u.role)
        })[0];
    } catch (e) {
        throw new Error(`Failed to add use to DB: ${e.message}`);
    } finally {
        client && client.release();
    }
}