using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chatbot.Connection
{
    public class Connection
    {
        const string quote = "\"";
        //enter Connection String 
        public string connectionString { get; set; } = "server=DESKTOP-LH3V603" + @"\" + "SQLEXPRESS;database=Chatbot;integrated security=SSPI";
    }
}