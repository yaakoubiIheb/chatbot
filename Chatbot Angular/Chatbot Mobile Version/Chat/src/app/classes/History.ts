import { UserService } from "../services/user.service";
import { User } from "./User";

export class HistoryClass{

    public user:User = null;
    constructor(
        public id?:number,
        public message?:string,
        public date?:string,
        public userId?:number,
        public ruleTitle?:string,
        public userService?:UserService
    ){
    }
}