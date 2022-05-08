using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace Chatbot.Models
{
    [DataContract]
    public class Conversation : Rule
    {
        [DataMember]
        public List<ConversationResponse> conversationResponses = new List<ConversationResponse>();
    }
}