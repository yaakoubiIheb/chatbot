using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace Chatbot.Models
{
    [DataContract]
    public class Function_Rule
    {
        [DataMember]
        public int functionId { get; set; }
        [DataMember]
        public int ruleId { get; set; }
    }
}