export class SequenceMessage{
    constructor(
        public id?:number,
        public question?:string,
        public attribute?:string,
        public sequenceType?:string,
        public ruleId?:number){}
}