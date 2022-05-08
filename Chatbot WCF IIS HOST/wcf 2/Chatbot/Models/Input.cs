using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace Chatbot.Models
{
    [DataContract]
    public class Input : SequenceMessage
    {
        [DataMember]
        public string valueType { get; set; }
        [DataMember]
        public string controlType { get; set; }
    }
}