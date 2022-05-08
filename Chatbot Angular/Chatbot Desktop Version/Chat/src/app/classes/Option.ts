import { OptionMessage } from "./OptionMessage";
import { SequenceMessage } from "./SequenceMessage";

export class Option extends SequenceMessage{
    constructor(
        public id?:number,
        public question?:string,
        public attribute?:string,
        public sequenceType?:string,
        public ruleId?:number,
        public optionMessages?:OptionMessage[]
    ){
        super(id,question,attribute,sequenceType,ruleId);
        if(optionMessages == null)optionMessages = [];
    }
}