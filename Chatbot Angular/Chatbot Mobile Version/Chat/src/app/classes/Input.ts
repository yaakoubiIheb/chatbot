import { SequenceMessage } from "./SequenceMessage";

export class Input extends SequenceMessage{
    constructor(
        public id?:number,
        public question?:string,
        public attribute?:string,
        public sequenceType?:string,
        public ruleId?:number,
        public valueType?:string,
        public controlType?:string
    ){
        super(id,question,attribute,sequenceType,ruleId);
    }
}