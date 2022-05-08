using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Chatbot.Models;
using System.Data.SqlClient;

namespace Chatbot.Dao
{
    public class ConversationResponseDao
    {
        private static Connection.Connection connection = new Connection.Connection();

        public static List<ConversationResponse> getAllConversationResponses(int conversationId)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                List<ConversationResponse> conversationResponses = new List<ConversationResponse>();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[ConversationResponse] where " +
                    "[Chatbot].[dbo].[ConversationResponse].[conversationId]='" + conversationId + "'", conn);
                SqlDataReader rdr = select.ExecuteReader();
                while (rdr.Read())
                {
                    ConversationResponse conversationResponse = new ConversationResponse();

                    conversationResponse.id = int.Parse(rdr["id"].ToString());
                    conversationResponse.response = rdr["response"].ToString();
                    conversationResponse.conversationId = int.Parse(rdr["conversationId"].ToString());

                    conversationResponses.Add(conversationResponse);
                }
                conn.Close();
                return conversationResponses;
            }
        }

        public static Boolean conversationResponseExist(int conversationResponseid)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[ConversationResponse] " +
                    "WHERE [Chatbot].[dbo].[ConversationResponse].[id] = @conversationResponseId", conn);
                select.Parameters.AddWithValue("@conversationResponseId", conversationResponseid);
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

        public static string insertConversationResponses(int conversationId, List<ConversationResponse> conversationResponses)
        {
            if (!ConversationDao.conversationExistById(conversationId))
            {
                return "Conversation n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    foreach (ConversationResponse conversationR in conversationResponses)
                    {
                        SqlCommand insert = new SqlCommand("insert into [Chatbot].[dbo].[conversationResponse] values(@response,@conversationId)", conn);
                        insert.Parameters.AddWithValue("@response", conversationR.response);
                        insert.Parameters.AddWithValue("@conversationId", conversationId);

                        int result = insert.ExecuteNonQuery();
                    }
                    conn.Close();
                    return "Réponses ajoutées avec succès";
                }
            }
        }

        public static string updateConversationResponses(int conversationId, List<ConversationResponse> conversationResponses)
        {
            if (!ConversationDao.conversationExistById(conversationId))
            {
                return "Conversation n'existe pas";
            }
            else
            {
                List<ConversationResponse> oldConversationResponses = getAllConversationResponses(conversationId);
                //delete Old values
                foreach (ConversationResponse oldConversationR in oldConversationResponses)
                {
                    bool exist = false;
                    foreach (ConversationResponse newConversationR in conversationResponses)
                    {
                        if (oldConversationR.id == newConversationR.id) exist = true;
                    }
                    if (!exist) { deleteConversationResponse(oldConversationR.id); }
                }

                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {

                    foreach (ConversationResponse conversationR in conversationResponses)
                    {
                        //insert new values
                        if (!conversationResponseExist(conversationR.id))
                        {
                            List<ConversationResponse> newConversationResponses = new List<ConversationResponse>();
                            newConversationResponses.Add(conversationR);
                            insertConversationResponses(conversationId, newConversationResponses);
                            newConversationResponses.Clear();
                        }
                        else
                        {
                            conn.Open();
                            //update existing values
                            SqlCommand update = new SqlCommand("UPDATE [Chatbot].[dbo].[ConversationResponse] SET " +
                            "[Chatbot].[dbo].[ConversationResponse].[response] = @response " +
                            "where [Chatbot].[dbo].[ConversationResponse].[id]= @id", conn);

                            update.Parameters.AddWithValue("@response", conversationR.response);
                            update.Parameters.AddWithValue("@id", conversationR.id);

                            int result = update.ExecuteNonQuery();
                            conn.Close();
                        }
                    }
                    return "Réponses modifiées avec succès";
                }
            }
        }

        public static string deleteConversationResponse(int conversationResponseId)
        {
            if (!conversationResponseExist(conversationResponseId))
            {
                return "Réponse n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    SqlCommand delete = new SqlCommand("DELETE FROM [Chatbot].[dbo].[ConversationResponse] where [Chatbot].[dbo].[ConversationResponse]" +
                      ".[id]= @id", conn);
                    delete.Parameters.AddWithValue("@id", conversationResponseId);
                    int result = delete.ExecuteNonQuery();
                    conn.Close();
                }
                return "Réponse supprimée avec succès";
            }
        }
        public static string deleteAllConversationResponses(int conversationId)
        {
            if (!ConversationDao.conversationExistById(conversationId))
            {
                return "Conversation n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    SqlCommand delete = new SqlCommand("DELETE FROM [Chatbot].[dbo].[ConversationResponse] where [Chatbot].[dbo].[ConversationResponse]" +
                      ".[conversationId]= @id", conn);
                    delete.Parameters.AddWithValue("@id", conversationId);
                    int result = delete.ExecuteNonQuery();
                    conn.Close();
                }
                return "Réponses supprimées avec succès";
            }
        }
    }
}