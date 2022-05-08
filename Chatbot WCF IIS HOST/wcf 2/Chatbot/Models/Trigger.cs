using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace Chatbot.Models
{
    [DataContract]
    public class Trigger
    {
        [DataMember]
        public int id { get; set; }
        [DataMember]
        public string message { get; set; }
        [DataMember]
        public int ruleId { get; set; }
    }
}