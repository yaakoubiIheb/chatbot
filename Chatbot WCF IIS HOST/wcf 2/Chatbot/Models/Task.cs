using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace Chatbot.Models
{
    [DataContract]
    public class Task : Rule
    {
        [DataMember]
        public string method { get; set; }
        [DataMember]
        public string api { get; set; }
        [DataMember]
        public List<SequenceMessage> sequenceMessages { get; set; } = new List<SequenceMessage>();
        [DataMember]
        public string responseType { get; set; }
        [DataMember]
        public string graphType { get; set; }

    }
}