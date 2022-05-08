using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;


namespace Chatbot.Models
{
    [DataContract]
    public class RuleFunctions
    {
        [DataMember]
        public int ruleId { get; set; }
        [DataMember]
        public int[] functionIds { get; set; }
    }
}