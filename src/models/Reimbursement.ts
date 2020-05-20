/* Any class that implements IReimbursement must have a reimbursementId, author, amount,
dateSubmitted, dateResolved, description, resolver, status, and type.
*/
export class Reimbursement {
    reimbursementId : number; // primary key
        author : number; // foreign key -> User, not null
        amount : number; // not null
    dateSubmitted : Date; // not null
    dateResolved : Date; // not null
    description : string; // not null
    resolver : number; // foreign key -> User
    status : number; // foreign key -> ReimbursementStatus, not null
    type : number; // foreign key -> Reimbursement Type
    
    constructor(reimbursementId:number, author:number, amount:number, dateSubmitted:Date, dateResolved:Date, description:string, resolver:number, status:number, type:number){
        this.reimbursementId = reimbursementId;
        this.author = author;
        this.amount = amount;
        this.dateSubmitted =dateSubmitted;
        this.dateResolved = dateResolved;
        this.description = description;
        this.resolver = resolver;
        this.status = status;
        this.type =type;
    }
}

