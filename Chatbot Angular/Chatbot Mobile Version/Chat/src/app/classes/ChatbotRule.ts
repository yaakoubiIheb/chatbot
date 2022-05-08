import { ChatbotSequenceMessage } from "./ChatbotSequenceMessage";
import { SequenceMessage } from "./SequenceMessage";

export class ChatbotRule{
    constructor(
        public tag?:string,
        public description?:string,
        public trigger?:string[],
        public responses?:string[],
        public type?:string,
        public responseType?:string,
        public api?:string,
        public methode?:string,
        public graphType?:string,
        public sequence?:ChatbotSequenceMessage[]){}

}