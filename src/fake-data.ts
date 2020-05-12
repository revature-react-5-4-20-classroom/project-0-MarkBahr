import { User } from './models/User';
import { Reimbursement } from './models/Reimbursement';

export const users : User[] = [
    new User(1, 'gGreen', '123password', 'Gene', "Green", 'green87@gmail.com', 'Admin'),
    new User(2, 'bWhite', '456changeme', 'Ben', 'White', 'benwhite@gmail.com', 'Admin'),
]

export const reimbursements : Reimbursement[] = [
    new Reimbursement(100, 1, 200, 1220, 12020, 'Instruction room projector', 2, 1, 5),
    new Reimbursement(101, 2, 30, 21520, 22520, 'faculty speakers', 1, 2, 7),
]