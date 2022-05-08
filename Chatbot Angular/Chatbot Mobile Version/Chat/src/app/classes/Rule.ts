import { SequenceMessage } from "./SequenceMessage";
import { Trigger } from "./Trigger";
export class Rule{

    constructor(
        public id?,
        public title?: string,
        public description?: string,
        public ruleType?:string,
        public triggers?:Trigger[],
        public sequenceMessages?:SequenceMessage[],
        ){}
}