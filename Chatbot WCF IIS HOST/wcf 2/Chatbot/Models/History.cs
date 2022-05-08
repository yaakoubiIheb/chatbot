using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chatbot.Models
{
    public class History
    {
        public int id { get; set; }
        public string message { get; set; }
        public string date { get; set; }
        public string ruleTitle { get; set; }
        public int userId { get; set; }
    }
}