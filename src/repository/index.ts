// You may enc

import { Pool } from 'pg';

// The "Pool" above is a "Connection Pool" that represents m
// The pool is a factory for connections. 
// in production, you'll always use a pool insead of a single connnection 
// ( a client is used for a single connection)

/* Here specify how to connect to database. Same cred's we used when
connecting to DBeaver. Run some Git Bash commands to store our credentials, 
then process to retreive. 
*/


// bad practice to put usernamd & password directly in the code. 
// We can store/retrieve any value we want with a name and a value:
// in Git BASH: export NAME=value
// in node: process.env['NAME'] will return value

export const connectionPool : Pool = new Pool({
    host: process.env['PG_HOST'],
    user: process.env['PG_USER'],
    password: process.env['PG_PASSWORD'],
    database: process.env['PG_DATABASE'],
    port: 5432,
    max:4 // max number of connections
});
