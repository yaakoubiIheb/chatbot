using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Chatbot.Models;
using System.Data.SqlClient;

namespace Chatbot.Dao
{
    public class StatisticsDao
    {
        private static Connection.Connection connection = new Connection.Connection();

        public static int getNumberOfUsers()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                int count = 0;
                SqlCommand select = new SqlCommand("SELECT COUNT(*) count FROM [Chatbot].[dbo].[Employee]", conn);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    count = int.Parse(rdr["count"].ToString());
                }
                conn.Close();
                return count;
            }
        }

        public static int getNumberOfConversations()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                int count = 0;
                SqlCommand select = new SqlCommand("SELECT COUNT(*) count FROM [Chatbot].[dbo].[Conversation]", conn);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    count = int.Parse(rdr["count"].ToString());
                }
                conn.Close();
                return count;
            }
        }

        public static int getNumberOfTasks()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                int count = 0;
                SqlCommand select = new SqlCommand("SELECT COUNT(*) count FROM [Chatbot].[dbo].[Task]", conn);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    count = int.Parse(rdr["count"].ToString());
                }
                conn.Close();
                return count;
            }
        }

        public static int getNumberOfFunctions()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                int count = 0;
                SqlCommand select = new SqlCommand("SELECT COUNT(*) count FROM [Chatbot].[dbo].[Function]", conn);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    count = int.Parse(rdr["count"].ToString());
                }
                conn.Close();
                return count;
            }
        }

        public static int getTotalNumberOfMessages()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                int count = 0;
                SqlCommand select = new SqlCommand("SELECT COUNT(*) count FROM [Chatbot].[dbo].[MessageHistory]", conn);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    count = int.Parse(rdr["count"].ToString());
                }
                conn.Close();
                return count;
            }
        }

        public static int getNumberOfMissedMessages()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                int count = 0;
                SqlCommand select = new SqlCommand("SELECT COUNT(*) count " +
                    "FROM [Chatbot].[dbo].[MessageHistory] " +
                    "WHERE ruleTitle = ''", conn);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    count = int.Parse(rdr["count"].ToString());
                }
                conn.Close();
                return count;
            }
        }

        public static List<History> getAllMissedMessages()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                List<History> histories = new List<History>();
                SqlCommand select = new SqlCommand("SELECT *" +
                    "FROM [Chatbot].[dbo].[MessageHistory] " +
                    "WHERE ruleTitle = ''", conn);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    History history = new History();
                    history.id = int.Parse(rdr["id"].ToString());
                    history.message = rdr["message"].ToString();
                    history.date = rdr["date"].ToString();
                    history.userId = int.Parse(rdr["userId"].ToString());
                    history.ruleTitle = rdr["RuleTitle"].ToString();
                    histories.Add(history);
                }
                conn.Close();
                return histories;
            }
        }

        public static Chart getMostExecutedConversations()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                Chart chart = new Chart();
                chart.type = "bar";
                SqlCommand select = new SqlCommand("SELECT h.RuleTitle,count(*) count " +
                    "FROM[Chatbot].[dbo].[Rule] c,[Chatbot].[dbo].[MessageHistory] h " +
                    "WHERE h.RuleTitle = c.Title AND c.RuleType = 'Conversation' AND h.Message <> '' " +
                    "GROUP BY h.RuleTitle " +
                    "ORDER BY count Desc " +
                    "OFFSET 0 ROWS FETCH FIRST 5 ROWS ONLY; ", conn);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {

                    ChartData chartData = new ChartData();
                    for (int i = 0; i < chart.labels.Count; i++) chartData.data.Add(0);
                    chartData.data.Add(int.Parse(rdr["count"].ToString()));
                    chartData.label = rdr["RuleTitle"].ToString();
                    chart.labels.Add(rdr["RuleTitle"].ToString());
                    chart.dataSets.Add(chartData);
                }
                conn.Close();
                return chart;
            }
        }

        public static Chart getMostExecutedTasks()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                Chart chart = new Chart();
                chart.type = "bar";
                SqlCommand select = new SqlCommand("SELECT h.RuleTitle,count(*) count " +
                    "FROM[Chatbot].[dbo].[Rule] c,[Chatbot].[dbo].[MessageHistory] h " +
                    "WHERE h.RuleTitle = c.Title AND c.RuleType = 'Tache' AND h.Message <> '' " +
                    "GROUP BY h.RuleTitle " +
                    "ORDER BY count Desc " +
                    "OFFSET 0 ROWS FETCH FIRST 5 ROWS ONLY; ", conn);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    ChartData chartData = new ChartData();
                    for (int i = 0; i < chart.labels.Count; i++) chartData.data.Add(0);
                    chartData.data.Add(int.Parse(rdr["count"].ToString()));
                    chartData.label = rdr["RuleTitle"].ToString();
                    chart.labels.Add(rdr["RuleTitle"].ToString());
                    chart.dataSets.Add(chartData);
                }
                conn.Close();
                return chart;
            }
        }

        public static Chart getNumberOfMessagesPerDate()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                Chart chart = new Chart();
                chart.type = "line";
                SqlCommand select = new SqlCommand("SELECT substring(date,1,10) date,count(*) count " +
                    "FROM[Chatbot].[dbo].[MessageHistory] " +
                    "GROUP BY substring(date, 1, 10) " +
                    "ORDER BY substring(date, 1, 10) " +
                    "OFFSET 0 ROWS FETCH FIRST 50 ROWS ONLY", conn);
                SqlDataReader rdr = select.ExecuteReader();
                ChartData chartData = new ChartData();
                while (rdr.Read())
                {
                    chart.labels.Add(rdr["date"].ToString());
                    chartData.data.Add(int.Parse(rdr["count"].ToString()));
                    chartData.label = "Nombre de messages";
                }
                chart.dataSets.Add(chartData);
                conn.Close();
                return chart;
            }
        }

        public static Chart getNumberOfMessagesPerFunctionAndDate()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                Chart chart = new Chart();
                chart.type = "line";
                SqlCommand select = new SqlCommand("SELECT f.title,substring(date,1,10) date,count(*) count " +
                    "FROM[Chatbot].[dbo].[MessageHistory] h,[Chatbot].[dbo].[Function] f, [Chatbot].[dbo].[Employee] e " +
                    "WHERE e.id = h.UserId AND e.FunctionId = f.id " +
                    "GROUP BY f.title, substring(date, 1, 10) " +
                    "ORDER BY f.title desc, count desc " +
                    "OFFSET 0 ROWS FETCH FIRST 50 ROWS ONLY; ", conn);
                SqlDataReader rdr = select.ExecuteReader();
                ChartData chartData = new ChartData();
                string titleCounter = "";
                while (rdr.Read())
                {
                    bool labelExist = false;
                    for (int i = 0; i < chart.labels.Count; i++)
                    {
                        if (chart.labels[i] == rdr["date"].ToString()) labelExist = true;
                    }
                    if (!labelExist) chart.labels.Add(rdr["date"].ToString());
                }
                while (rdr.Read())
                {
                    if (titleCounter != rdr["title"].ToString())
                    {
                        chartData = new ChartData();
                        chart.dataSets.Add(chartData);
                    }


                    for (int i = 0; i < chart.labels.Count; i++)
                    {
                        if (chart.labels[i] == rdr["date"].ToString())
                        {
                            chartData.data.Add(int.Parse(rdr["count"].ToString()));
                        }
                        else
                        {
                            chartData.data.Add(0);
                        }
                    }
                    chartData.label = rdr["title"].ToString();
                }
                chart.dataSets.Add(chartData);
                conn.Close();
                return chart;
            }
        }

        public static Chart getNumberOfMessagesPerFunction()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                Chart chart = new Chart();
                chart.type = "pie";
                SqlCommand select = new SqlCommand("SELECT f.title,count(*) count " +
                    "FROM[Chatbot].[dbo].[MessageHistory] h,[Chatbot].[dbo].[Function] f, [Chatbot].[dbo].[Employee] e " +
                    "WHERE e.id = h.UserId AND e.FunctionId = f.id " +
                    "GROUP BY f.title " +
                    "ORDER BY count Desc " +
                    "OFFSET 0 ROWS FETCH FIRST 50 ROWS ONLY", conn);
                SqlDataReader rdr = select.ExecuteReader();
                ChartData chartData = new ChartData();
                while (rdr.Read())
                {
                    chartData.data.Add(int.Parse(rdr["count"].ToString()));
                    chart.labels.Add(rdr["title"].ToString());
                }
                chartData.label = "Nombre de messages par fonction";
                chart.dataSets.Add(chartData);
                conn.Close();
                return chart;
            }
        }

        private static string getRandomColor()
        {
            Random rnd = new Random();
            string hexOutput = String.Format("{0:X}", rnd.Next(0, 0xFFFFFF));
            while (hexOutput.Length < 6)
                hexOutput = "0" + hexOutput;
            return "#" + hexOutput;
        }

    }
}