import { Rule } from "./Rule";

export class LocalTask{
    constructor(
        public data:any,
        public type:string,
        public username:string,
        public ruleTitle:string,
        public date:string
    ){}
}

export class LocalRule{
    constructor(
        public rule:Rule,
        public username:string
    ){}
}