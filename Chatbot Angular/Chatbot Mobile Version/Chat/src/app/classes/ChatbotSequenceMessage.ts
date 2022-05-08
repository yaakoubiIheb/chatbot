import { ChatbotOption } from "./ChatbotOption";

export class ChatbotSequenceMessage{
    constructor(
        public question?:string,
        public attribute?:string,
        public sequenceType?:string,
        public options?: ChatbotOption[],
        public valueType?:string,
        public controlType?:string,
    ){
        if(this.options == null)this.options = [];

    }
}
