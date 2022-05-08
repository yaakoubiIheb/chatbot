using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using Chatbot.Models;

namespace Chatbot.Dao
{
    public class RuleDao
    {
        private static Connection.Connection connection = new Connection.Connection();
        public static Boolean ruleExist(string title)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule] " +
                    "WHERE [Chatbot].[dbo].[Rule].[title] = @title", conn);
                select.Parameters.AddWithValue("@title", title);
                SqlDataReader rdr = select.ExecuteReader();
                if (rdr.HasRows)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public static Rule getRuleByTitle(string title)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                Rule rule = new Rule();
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule] " +
                    "WHERE [Chatbot].[dbo].[Rule].[title] = @title", conn);
                select.Parameters.AddWithValue("@title", title);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    rule.id = int.Parse(rdr["id"].ToString());
                    rule.title = rdr["title"].ToString();
                    rule.description = rdr["description"].ToString();
                    rule.ruleType = rdr["ruleType"].ToString();
                    rule.triggers = TriggerDao.getAllRuleTriggers(rule.id);
                }
                conn.Close();
                return rule;
            }
        }

        public static List<Rule> getAllRules()
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                List<Rule> rules = new List<Rule>();
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule]", conn);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    Rule rule = new Rule();
                    rule.id = int.Parse(rdr["id"].ToString());
                    rule.title = rdr["title"].ToString();
                    rule.description = rdr["description"].ToString();
                    rule.ruleType = rdr["ruleType"].ToString();
                    rule.triggers = TriggerDao.getAllRuleTriggers(rule.id);
                    rules.Add(rule);
                }
                conn.Close();
                return rules;
            }
        }


        public static Rule getRuleById(int id)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                Rule rule = new Rule();
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule] " +
                    "WHERE [Chatbot].[dbo].[Rule].[id] = @id", conn);
                select.Parameters.AddWithValue("@id", id);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    rule.id = int.Parse(rdr["id"].ToString());
                    rule.title = rdr["title"].ToString();
                    rule.description = rdr["description"].ToString();
                    rule.ruleType = rdr["ruleType"].ToString();
                    rule.triggers = TriggerDao.getAllRuleTriggers(rule.id);
                }
                conn.Close();
                return rule;
            }
        }
        public static Boolean ruleExistById(int ruleId)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule] " +
                    "WHERE [Chatbot].[dbo].[Rule].[id] = @ruleId", conn);
                select.Parameters.AddWithValue("@ruleId", ruleId);
                SqlDataReader rdr = select.ExecuteReader();
                if (rdr.HasRows)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }





    }
}