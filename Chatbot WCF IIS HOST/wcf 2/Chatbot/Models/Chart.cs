using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chatbot.Models
{
    public class Chart
    {
        public string type { get; set; }
        public List<string> labels = new List<string>();
        public List<ChartData> dataSets = new List<ChartData>();
    }
}