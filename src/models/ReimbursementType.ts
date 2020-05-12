// Used to track the kind of reimbursement being submitted.

export class ReimbursementType {
    typeId : number; // primary key
    type: string; // not null, unique
}