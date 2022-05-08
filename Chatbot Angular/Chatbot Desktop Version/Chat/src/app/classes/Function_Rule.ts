export class Function_Rule{
    constructor(
        public ruleId:number,
        public functionIds : number[]
    ){
        if(this.functionIds == null) this.functionIds = [];
    }
}