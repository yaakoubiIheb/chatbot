using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Chatbot.Models;
using System.Data.SqlClient;


namespace Chatbot.Dao
{
    public class Function_RuleDao
    {
        private static Connection.Connection connection = new Connection.Connection();
        public static List<Function> getAllRuleFunctions(int ruleId)
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
                    List<Function> functions = new List<Function>();
                    SqlCommand select = new SqlCommand("SELECT f.* FROM [Chatbot].[dbo].[Function] f,[Chatbot].[dbo].[Function_Rule] fr " +
                        "WHERE fr.RuleId = @ruleId AND fr.FunctionID = f.id", conn);
                    select.Parameters.AddWithValue("@ruleId", ruleId);
                    SqlDataReader rdr = select.ExecuteReader();
                    while (rdr.Read())
                    {
                        Function function = new Function();
                        function.id = int.Parse(rdr["id"].ToString());
                        function.title = rdr["title"].ToString();
                        function.description = rdr["description"].ToString();
                        function.permissionId = int.Parse(rdr["permissionId"].ToString());
                        functions.Add(function);
                    }
                    conn.Close();
                    return functions;
                }
            }
        }

        public static Boolean FunctionRuleExist(int ruleId, int functionId)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Function_Rule] " +
                    "WHERE [Chatbot].[dbo].[Function_Rule].[RuleId] = @ruleId AND" +
                    "[Chatbot].[dbo].[Function_Rule].[FunctionId] = @functionId", conn);
                select.Parameters.AddWithValue("@functionId", functionId);
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

        public static List<Conversation> getAllFunctionConversations(int functionId)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                List<Conversation> conversations = new List<Conversation>();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule] " +
                    "WHERE [Chatbot].[dbo].[Rule].[RuleType] = @ruleType " +
                    "AND [Chatbot].[dbo].[Function_Rule].[FunctionId] = @functionId " +
                    "AND [Chatbot].[dbo].[Function_Rule].[ruleId] = [Chatbot].[dbo].[Rule].[id]", conn);
                select.Parameters.AddWithValue("@ruleType", "Conversation");
                select.Parameters.AddWithValue("@functionId", functionId);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    Conversation conversation = new Conversation();

                    conversation.id = int.Parse(rdr["id"].ToString());
                    conversation.title = rdr["title"].ToString();
                    conversation.description = rdr["description"].ToString();
                    conversation.ruleType = rdr["ruleType"].ToString();
                    conversation.triggers = TriggerDao.getAllRuleTriggers(conversation.id);
                    conversation.conversationResponses = ConversationResponseDao.getAllConversationResponses(conversation.id);
                    conversations.Add(conversation);
                }
                conn.Close();
                return conversations;
            }

        }

        public static List<Task> getAllFunctionTasks(int functionId)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                List<Task> tasks = new List<Task>();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule] " +
                    "WHERE [Chatbot].[dbo].[Rule].[RuleType] = @ruleType " +
                    "AND [Chatbot].[dbo].[Function_Rule].[FunctionId] = @functionId " +
                    "AND [Chatbot].[dbo].[Function_Rule].[ruleId] = [Chatbot].[dbo].[Rule].[id]", conn);
                select.Parameters.AddWithValue("@ruleType", "Tache");
                select.Parameters.AddWithValue("@functionId", functionId);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    Task task = new Task();

                    task.id = int.Parse(rdr["id"].ToString());
                    task.title = rdr["title"].ToString();
                    task.description = rdr["description"].ToString();
                    task.ruleType = rdr["ruleType"].ToString();
                    task.method = rdr["method"].ToString();
                    task.api = rdr["api"].ToString();
                    task.responseType = rdr["responseType"].ToString();
                    task.graphType = rdr["graphType"].ToString();
                    task.triggers = TriggerDao.getAllRuleTriggers(task.id);
                    task.sequenceMessages.AddRange(OptionDao.getAllRuleOptions(task.id));
                    task.sequenceMessages.AddRange(InputDao.getAllRuleInputs(task.id));

                    tasks.Add(task);
                }
                conn.Close();
                return tasks;
            }

        }

        public static string insertRuleFunctions(int ruleId, int[] functionIds)
        {
            if (!RuleDao.ruleExistById(ruleId))
            {
                return "Régle n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    //Insert into Function_Rule
                    foreach (int functionId in functionIds)
                    {
                        conn.Open();
                        SqlCommand insert = new SqlCommand("insert into [Chatbot].[dbo].[Function_Rule] values(@ruleId,@functionId)", conn);
                        insert.Parameters.AddWithValue("@ruleId", ruleId);
                        insert.Parameters.AddWithValue("@functionId", functionId);
                        int resultRule = insert.ExecuteNonQuery();
                        conn.Close();
                    }
                }
                return "Fonctions ajoutées avec succès";
            }
        }


        public static string updateRuleFunctions(int ruleId, int[] functionIds)
        {
            if (!RuleDao.ruleExistById(ruleId))
            {
                return "Régle n'existe pas";
            }
            else
            {
                deleteRuleFunctions(ruleId);
                insertRuleFunctions(ruleId, functionIds);
                return "Fonctions modifées avec succès";
            }
        }
        public static string deleteRuleFunctions(int ruleId)
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
                    SqlCommand delete = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Function_Rule] where [Chatbot].[dbo].[Function_Rule]" +
                        ".[ruleId] = @ruleId", conn);
                    delete.Parameters.AddWithValue("@ruleId", ruleId);
                    int result = delete.ExecuteNonQuery();
                    conn.Close();
                }
                return "Fonctions supprimées avec succès";
            }
        }

        public static void deleteFunctionRules(int functionId)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand delete = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Function_Rule] where [Chatbot].[dbo].[Function_Rule]" +
                    ".[functionId] = @functionId", conn);
                delete.Parameters.AddWithValue("@functionId", functionId);
                int result = delete.ExecuteNonQuery();
                conn.Close();
            }
        }
    }
}