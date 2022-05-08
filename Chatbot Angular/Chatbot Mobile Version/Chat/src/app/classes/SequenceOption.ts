import { SequenceMessage } from "./SequenceMessage";

export class SequenceOption{

    public option : string;
    public attribute : string;

    constructor(option:string,attribute:string){
        this.option = option;
        this.attribute = attribute;
    }
}