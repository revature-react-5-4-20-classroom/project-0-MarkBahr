/* Any class that implements this must have a userId, username, password, 
firstName, lastName, email, and role.
*/

export default interface IUser {
    useId : number, // primary key
    username: string, // not null
    password: string, // not null
    firstName: string, // not null
    lastName: string, // not null
    email: string, // not null
    role: Role // not null
}

// This Role is incorporated into the IUser interface. 
class Role {
    roleId : number; // primary key
    role : string; //not null, unique
}

