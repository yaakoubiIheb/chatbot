import { DatePipe } from "@angular/common";
export class ChatbotMessages {
    constructor(public message?: string, public type?: string, public value?: string) { }
};
export class Message {
    constructor(
        public message: String,
        public sender: string,
        public type: string = "",
        public date : string,
        public optionValue?: string) {
    }

}

