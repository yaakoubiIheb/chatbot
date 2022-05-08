using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace Chatbot.Models
{
    [DataContract]
    [KnownType(typeof(Option)), KnownType(typeof(Input))]
    public class SequenceMessage
    {
        [DataMember]
        public int id { get; set; }
        [DataMember]
        public string question { get; set; }
        [DataMember]
        public string attribute { get; set; }
        [DataMember]
        public string sequenceType { get; set; }
        [DataMember]
        public int ruleId { get; set; }

    }
}