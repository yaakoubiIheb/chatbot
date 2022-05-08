import { Rule } from "./Rule";
import { SequenceMessage } from "./SequenceMessage";
import { Trigger } from "./Trigger";

export class Task extends Rule{
    constructor(
        public id?,
        public title?: string,
        public description?: string,
        public ruleType?:string,
        public triggers?:Trigger[],
        public sequenceMessages?:SequenceMessage[],
        public method?:string,
        public api?:string,
        public responseType?:string,
        public graphType?:string){
            
            super(id,title,description,ruleType,sequenceMessages);

    }
    
}