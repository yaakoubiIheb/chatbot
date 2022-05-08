export class Connection{
    //Connection To Backend URL/DOMAIN
    private static _backendUrl = "http://desktop-lh3v603//ChatbotServices/";
    private static _chatbotUrl = "http://desktop-lh3v603:5000/";

    public static get BackendUrl(){
        return this._backendUrl;
    }

    public static get ChatbotUrl(){
        return this._chatbotUrl;
    } 
}