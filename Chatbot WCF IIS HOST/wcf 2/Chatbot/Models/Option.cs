using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace Chatbot.Models
{
    [DataContract]
    public class Option : SequenceMessage
    {
        [DataMember]
        public List<OptionMessage> optionMessages { get; set; } = new List<OptionMessage>();
    }
}