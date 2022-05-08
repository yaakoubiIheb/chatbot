export class ConversationResponse{
    constructor(
        public id?:number,
        public response?: string,
        public conversationId?: number
    ){}
}