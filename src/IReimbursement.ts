/* Any class that implements IReimbursement must have a reimbursementId, author, amount,
dateSubmitted, dateResolved, description, resolver, status, and type.
*/
export default interface IReimbursement {
    reimbursementId : number, // primary key
        author : number, // foreign key -> User, not null
        amount : number, // not null
    dateSubmitted : number, // not null
    dateResolved : number, // not null
    description : string, // not null
    resolver : number, // foreign key -> User
    status : number, // foreign key -> ReimbursementStatus, not null
    type : number, // foreign key -> Reimbursement Type
}

class ReimbursementStatus {
    statusId : number; // primary key
    status : string; // not null, unique
}

class ReimbursementType {
    typeId : number; // primary key
    type: string; // not null, unique
}