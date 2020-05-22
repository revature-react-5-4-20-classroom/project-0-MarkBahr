/* Any class that implements IReimbursement must have a reimbursementId, author, amount,
dateSubmitted, dateResolved, description, resolver, status, and type.
*/
export class Reimbursement {
    id : number; // primary key
        author : number; // foreign key -> User, not null
        amount : number; // not null
    date_submitted : Date; // not null
    date_resolved : Date; // not null
    description : string; // not null
    resolver : number; // foreign key -> User
    status : number; // foreign key -> ReimbursementStatus, not null
    reimbursement_type : number; // foreign key -> Reimbursement Type
    
    constructor(id:number, author:number, amount:number, date_submitted:Date, date_resolved:Date, description:string, resolver:number, status:number, reimbursement_type:number){
        this.id = id;
        this.author = author;
        this.amount = amount;
        this.date_submitted = date_submitted;
        this.date_resolved = date_resolved;
        this.description = description;
        this.resolver = resolver;
        this.status = status;
        this.reimbursement_type =reimbursement_type;
    }
}

