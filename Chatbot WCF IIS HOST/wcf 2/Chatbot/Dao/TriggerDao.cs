using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Chatbot.Models;
using System.Data.SqlClient;
namespace Chatbot.Dao
{
    public class TriggerDao
    {
        private static Connection.Connection connection = new Connection.Connection();
        public static List<Trigger> getAllRuleTriggers(int ruleId)
        {
            if (!RuleDao.ruleExistById(ruleId))
            {
                return null;
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    List<Trigger> triggers = new List<Trigger>();
                    SqlCommand selectTrigger = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[trigger] where " +
                        "[Chatbot].[dbo].[trigger].[ruleId]='" + ruleId + "'", conn);
                    SqlDataReader rdrTrigger = selectTrigger.ExecuteReader();
                    while (rdrTrigger.Read())
                    {
                        Trigger trigger = new Trigger();

                        trigger.id = int.Parse(rdrTrigger["id"].ToString());
                        trigger.ruleId = int.Parse(rdrTrigger["RuleId"].ToString());
                        trigger.message = rdrTrigger["message"].ToString();

                        triggers.Add(trigger);
                    }
                    conn.Close();
                    return triggers;
                }
            }
        }

        public static string insertRuleTriggers(int ruleId, List<Trigger> triggers)
        {
            if (!RuleDao.ruleExistById(ruleId))
            {
                return "Régle n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    foreach (Trigger trig in triggers)
                    {
                        conn.Open();
                        SqlCommand insertTrigger = new SqlCommand("insert into [Chatbot].[dbo].[trigger] values(@message,@RuleId)", conn);
                        insertTrigger.Parameters.AddWithValue("@message", trig.message);
                        insertTrigger.Parameters.AddWithValue("@RuleId", ruleId);

                        int resultTrigger = insertTrigger.ExecuteNonQuery();
                        conn.Close();
                    }
                }
                return "Déclencheurs ajoutés";
            }
        }

        public static Boolean triggerExist(int triggerId)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Trigger] " +
                    "WHERE [Chatbot].[dbo].[Trigger].[id] = @triggerId", conn);
                select.Parameters.AddWithValue("@triggerId", triggerId);
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

        public static string updateRuleTriggers(int ruleId, List<Trigger> triggers)
        {

            if (!RuleDao.ruleExistById(ruleId))
            {
                return "Régle n'existe pas";
            }
            else
            {
                //delete Old values
                List<Trigger> oldTriggers = getAllRuleTriggers(ruleId);
                foreach (Trigger oldTrigger in oldTriggers)
                {
                    bool exist = false;
                    foreach (Trigger newTrigger in triggers)
                    {
                        if (oldTrigger.id == newTrigger.id) exist = true;
                    }
                    if (!exist) { deleteTrigger(oldTrigger.id); }
                }
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    foreach (Trigger trigger in triggers)
                    {
                        //insert new values
                        if (!triggerExist(trigger.id))
                        {
                            List<Trigger> newTriggers = new List<Trigger>();
                            newTriggers.Add(trigger);
                            insertRuleTriggers(ruleId, newTriggers);
                            newTriggers.Clear();
                        }
                        else
                        {
                            //update Trigger
                            conn.Open();
                            SqlCommand updateTrigger = new SqlCommand("UPDATE [Chatbot].[dbo].[Trigger] SET" +
                        "[Chatbot].[dbo].[Trigger].[message] = @message " +
                        "where [Chatbot].[dbo].[Trigger].[id]= @id", conn);

                            updateTrigger.Parameters.AddWithValue("@message", trigger.message);
                            updateTrigger.Parameters.AddWithValue("@id", trigger.id);

                            int result = updateTrigger.ExecuteNonQuery();
                            conn.Close();

                        }

                    }

                }
                return "Déclencheurs modifiés";
            }
        }

        public static string deleteTrigger(int triggerId)
        {
            if (!triggerExist(triggerId))
            {
                return "Déclencheur n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    SqlCommand deleteTrigger = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Trigger] where [Chatbot].[dbo].[Trigger]" +
                      ".[id]= @id", conn);
                    deleteTrigger.Parameters.AddWithValue("@id", triggerId);
                    int result = deleteTrigger.ExecuteNonQuery();
                    conn.Close();
                }
                return "Déclencheur supprimé";
            }
        }

        public static string deleteRuleTriggers(int ruleId)
        {
            if (!RuleDao.ruleExistById(ruleId))
            {
                return "Régle n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    SqlCommand delete = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Trigger] where [Chatbot].[dbo].[Trigger]" +
                      ".[ruleId]= @ruleId", conn);
                    delete.Parameters.AddWithValue("@ruleId", ruleId);
                    int result = delete.ExecuteNonQuery();
                    conn.Close();
                }
                return "Déclencheurs supprimés";
            }
        }
    }
}