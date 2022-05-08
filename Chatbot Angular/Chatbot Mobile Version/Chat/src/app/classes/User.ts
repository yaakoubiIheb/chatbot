export class User{
    constructor(
        public id? :number,
        public username?:string,
        public name?:string,
        public lastname?: string,
        public address?: string,
        public telephoneNum?: string,
        public password?: string,
        public email?: string,
        public userType?:string,
        public functionId?:number){}  
}