import { User } from './models/User';
import { Reimbursement } from './models/Reimbursement';
import { Role } from './models/Role';

/* Use this if it's better to put roles into an array. 
export const roles : Role[] = [
    new Role(1, 'Finance Manager'),
    new Role(2, "Admin"),
    new Role(3, 'User')
]
*/

export const myUsers : User[] = [
    new User(7, 'gGreen', '123password', 'Gene', "Green", 'green87@gmail.com', 'Finance Manager'),
    new User(8, 'bWhite', '456changeme', 'Ben', 'White', 'benwhite@gmail.com', 'Administrator'),
    new User(9, 'bCase', '293quiztime', 'Brad', 'Camel', 'bradcam@yahoo.com', 'user')
]

// Remember to place the date inside ''. 
let date1 = new Date('2019-10-12');
let date2 = new Date('2019-10-29');
let date3 = new Date('2019-11-30');

export const reimbursements : Reimbursement[] = [
    new Reimbursement(100, 1, 200, date1, date2, 'Instruction room projector', 1, 1, 1),
    new Reimbursement(101, 2, 30, date2, date3, 'faculty speakers', 1, 2, 1),
    new Reimbursement(102, 1, 50, (new Date('2019-11-22')), (new Date('2020-0o1-0o2')), 'Turkey Dinner', 1, 6, 4)
]