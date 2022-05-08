using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace Chatbot.Models
{
    [DataContract]
    [KnownType(typeof(Conversation)), KnownType(typeof(Task))]
    public class Rule
    {
        [DataMember]
        public int id = default(int);
        [DataMember]
        public string title { get; set; }
        [DataMember]
        public string description { get; set; }
        [DataMember]
        public List<Trigger> triggers { get; set; } = new List<Trigger>();
        [DataMember]
        public string ruleType { get; set; }
    }
}