export class ApiAttribute{
    constructor(
        public attribute?:string,
        public values?:string[],
        public valueType?:string){
        if(values)this.values = values
        else this.values = [];
    }
}