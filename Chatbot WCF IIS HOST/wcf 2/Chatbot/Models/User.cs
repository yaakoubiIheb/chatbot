using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chatbot.Models
{
    public class User
    {
        public int id { get; set; }
        public string username { get; set; }
        public string name { get; set; }
        public string lastname { get; set; }
        public string address { get; set; }
        public string telephoneNum { get; set; }
        public string password { get; set; }
        public string email { get; set; }
        public string userType { get; set; }
    }
}