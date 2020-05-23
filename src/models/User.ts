/* Any class that implements this must have a userId, username, password, 
firstName, lastName, email, and role.
*/
import { Role } from './Role';

export class User {
    user_id : number; // primary key
    username: string; // not null
    password: string; // not null
    first_name: string; // not null
    last_name: string; // not null
    email: string; // not null
    role: number; // not null
    
    constructor(user_id:number, username:string, password:string, first_name:string, last_name:string, email:string, role:number) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.role = role;
    }
}



