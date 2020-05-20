/* Any class that implements this must have a userId, username, password, 
firstName, lastName, email, and role.
*/
import { Role } from './Role';

export class User {
    userId : number; // primary key
    username: string; // not null
    password: string; // not null
    firstName: string; // not null
    lastName: string; // not null
    email: string; // not null
    role: string; // not null
    
    constructor(userId:number, username:string, password:string, firstName:string, lastName:string, email:string, role:string) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }
}



