import { ConversationResponse } from "./ConversationResponse";
import { Rule } from "./Rule";
import { SequenceMessage } from "./SequenceMessage";
import { Trigger } from "./Trigger";

export class Conversation extends Rule{
    constructor(public id?,
        public title?: string,
        public description?: string,
        public ruleType?:string,
        public triggers?:Trigger[],
        public conversationResponses?:ConversationResponse[]){
            
            super( id,title,description,ruleType,triggers);
        }
}