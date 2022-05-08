using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace Chatbot.Models
{
    [DataContract]
    public class ConversationResponse
    {
        [DataMember]
        public int id { get; set; }
        [DataMember]
        public string response { get; set; }
        [DataMember]
        public int conversationId { get; set; }
    }
}