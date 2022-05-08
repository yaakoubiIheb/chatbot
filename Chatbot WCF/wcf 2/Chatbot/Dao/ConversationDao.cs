using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Chatbot.Models;
using System.Data.SqlClient;

namespace Chatbot.Dao
{
    public class ConversationDao
    {
        private static Connection.Connection connection = new Connection.Connection();
        public static List<Conversation> getAllConversations()
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                List<Conversation> conversations = new List<Conversation>();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule] " +
                    "WHERE [Chatbot].[dbo].[Rule].[RuleType] = @ruleType", conn);
                select.Parameters.AddWithValue("@ruleType", "Conversation");
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
        public static Conversation getConversationByTitle(string title)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule], [Chatbot].[dbo].[Conversation] " +
                    "WHERE [Chatbot].[dbo].[Rule].[title] = @title AND " +
                    "[Chatbot].[dbo].[Rule].[id] = [Chatbot].[dbo].[Conversation].[id]", conn);
                select.Parameters.AddWithValue("@title", title);
                SqlDataReader rdr = select.ExecuteReader();
                Conversation conversation = new Conversation();
                while (rdr.Read())
                {

                    conversation.id = int.Parse(rdr["id"].ToString());
                    conversation.title = rdr["title"].ToString();
                    conversation.description = rdr["description"].ToString();
                    conversation.ruleType = rdr["ruleType"].ToString();
                    conversation.triggers = TriggerDao.getAllRuleTriggers(conversation.id);
                    conversation.conversationResponses = ConversationResponseDao.getAllConversationResponses(conversation.id);
                }
                conn.Close();
                return conversation;
            }
        }

        public static Boolean conversationExistByTitle(string title)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Conversation], [Chatbot].[dbo].[Rule] " +
                  "WHERE [Chatbot].[dbo].[Conversation].[id] = [Chatbot].[dbo].[Rule].[id] AND " +
                  "[Chatbot].[dbo].[Rule].[title] = @title", conn);
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

        public static Boolean conversationExistById(int conversationId)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Conversation] " +
                    "WHERE [Chatbot].[dbo].[Conversation].[id] = @conversationId", conn);
                select.Parameters.AddWithValue("@conversationId", conversationId);
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

        public static string insertConversation(Conversation conversation)
        {
            if (RuleDao.ruleExist(conversation.title))
            {
                return "Conversation existe déjà";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    //Insert into Rule
                    SqlCommand insertRule = new SqlCommand("insert into [Chatbot].[dbo].[Rule] values(@title,@description,@ruleType)", conn);
                    insertRule.Parameters.AddWithValue("@title", conversation.title);
                    insertRule.Parameters.AddWithValue("@description", conversation.description);
                    insertRule.Parameters.AddWithValue("@ruleType", conversation.ruleType);
                    int resultRule = insertRule.ExecuteNonQuery();


                    //Select conversation Id
                    int conversationId = 0;
                    SqlCommand selectConversationId = new SqlCommand("SELECT IDENT_CURRENT('Rule')", conn);

                    SqlDataReader rdr = selectConversationId.ExecuteReader();
                    while (rdr.Read()) { conversationId = Convert.ToInt32(rdr.GetDecimal(0)); }
                    conn.Close();
                    conn.Open();
                    //Insert Into Conversation
                    SqlCommand insertConversation = new SqlCommand("insert into [Chatbot].[dbo].[Conversation] values(@id)", conn);
                    insertConversation.Parameters.AddWithValue("@id", conversationId);
                    int resultConversation = insertConversation.ExecuteNonQuery();
                    conn.Close();
                    //Insert Conversation responses
                    ConversationResponseDao.insertConversationResponses(conversationId, conversation.conversationResponses);
                    //Insert triggers
                    TriggerDao.insertRuleTriggers(conversationId, conversation.triggers);
                    return "Conversation ajoutée avec succès";
                }
            }
        }

        public static string updateConversation(Conversation conversation)
        {
            if (!RuleDao.ruleExist(conversation.title))
            {
                return "Conversation n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    //update Rule
                    SqlCommand updateRule = new SqlCommand("UPDATE [Chatbot].[dbo].[Rule] SET " +
                "[Chatbot].[dbo].[Rule].[title] = @title, " +
                "[Chatbot].[dbo].[Rule].[description] = @description " +
                "WHERE [Chatbot].[dbo].[Rule].[id]= @id", conn);
                    updateRule.Parameters.AddWithValue("@title", conversation.title);
                    updateRule.Parameters.AddWithValue("@description", conversation.description);
                    updateRule.Parameters.AddWithValue("@id", conversation.id);
                    int result = updateRule.ExecuteNonQuery();

                    conn.Close();
                    //update ConversationResponses
                    ConversationResponseDao.updateConversationResponses(conversation.id, conversation.conversationResponses);
                    //update Triggers
                    TriggerDao.updateRuleTriggers(conversation.id, conversation.triggers);
                    return "Conversation modifiée avec succès";
                }
            }
        }
        public static string deleteConversation(int conversationId)
        {
            if (!RuleDao.ruleExistById(conversationId))
            {
                return "Conversation n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {

                    //Delete Conversation Responses
                    ConversationResponseDao.deleteAllConversationResponses(conversationId);
                    //Delete Triggers
                    TriggerDao.deleteRuleTriggers(conversationId);
                    //delete From Conversation
                    conn.Open();
                    SqlCommand deleteConversation = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Conversation] where [Chatbot].[dbo].[Conversation]" +
                      ".[id]= @id", conn);
                    deleteConversation.Parameters.AddWithValue("@id", conversationId);
                    int result1 = deleteConversation.ExecuteNonQuery();
                    conn.Close();
                    conn.Open();
                    //Delete From Functon_Rule
                    Function_RuleDao.deleteRuleFunctions(conversationId);
                    //Delete From History
                    Rule rule = RuleDao.getRuleById(conversationId);
                    HistoryDao.deleteAllRuleHistory(rule.title);
                    //Delete From Rule
                    SqlCommand deleteRule = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Rule] where [Chatbot].[dbo].[Rule]" +
                      ".[id]= @id", conn);
                    deleteRule.Parameters.AddWithValue("@id", conversationId);
                    int result2 = deleteRule.ExecuteNonQuery();
                    conn.Close();
                    return "Conversation supprimée avec succès";
                }
            }

        }
    }
}