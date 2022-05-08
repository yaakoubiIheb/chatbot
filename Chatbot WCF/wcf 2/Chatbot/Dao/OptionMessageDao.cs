using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Chatbot.Models;
using System.Data.SqlClient;


namespace Chatbot.Dao
{
    public class OptionMessageDao
    {
        private static Connection.Connection connection = new Connection.Connection();

        public static List<OptionMessage> getAllSequenceOptionMessages(int optionId)
        {
            if (!OptionDao.optionExist(optionId))
            {
                return null;
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    List<OptionMessage> optionMessages = new List<OptionMessage>();
                    SqlCommand selectOptionMessage = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[OptionMessage] where " +
                        "[Chatbot].[dbo].[OptionMessage].[optionId]='" + optionId + "'", conn);
                    SqlDataReader rdrOptionMessage = selectOptionMessage.ExecuteReader();
                    while (rdrOptionMessage.Read())
                    {
                        OptionMessage optionMessage = new OptionMessage();

                        optionMessage.id = int.Parse(rdrOptionMessage["id"].ToString());
                        optionMessage.message = rdrOptionMessage["message"].ToString();
                        optionMessage.value = rdrOptionMessage["value"].ToString();
                        optionMessage.optionId = int.Parse(rdrOptionMessage["optionId"].ToString());

                        optionMessages.Add(optionMessage);
                    }
                    conn.Close();
                    return optionMessages;
                }
            }
        }

        public static Boolean optionMessageExist(int optionMessageId)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[OptionMessage] " +
                    "WHERE [Chatbot].[dbo].[OptionMessage].[id] = @optionMessageId", conn);
                select.Parameters.AddWithValue("@optionMessageId", optionMessageId);
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

        public static string insertOptionMessages(int optionId, List<OptionMessage> optionMessages)
        {
            if (!OptionDao.optionExist(optionId))
            {
                return "Option n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {

                    foreach (OptionMessage optionM in optionMessages)
                    {
                        conn.Open();
                        SqlCommand insertOptionMessage = new SqlCommand("insert into [Chatbot].[dbo].[OptionMessage] values(@message,@value,@optionId)", conn);
                        insertOptionMessage.Parameters.AddWithValue("@message", optionM.message);
                        insertOptionMessage.Parameters.AddWithValue("@value", optionM.value);
                        insertOptionMessage.Parameters.AddWithValue("@optionId", optionId);

                        int resultOptionMessage = insertOptionMessage.ExecuteNonQuery();
                        conn.Close();
                    }
                }
                return "Messages d'option ajoutés";
            }
        }

        public static string updateOptionMessages(int optionId, List<OptionMessage> optionMessages)
        {
            if (!OptionDao.optionExist(optionId))
            {
                return "Option n'existe pas";
            }
            else
            {
                List<OptionMessage> oldOptionMessages = getAllSequenceOptionMessages(optionId);
                //delete Old values
                foreach (OptionMessage oldOptionM in oldOptionMessages)
                {
                    bool exist = false;
                    foreach (OptionMessage newOptionM in optionMessages)
                    {
                        if (oldOptionM.id == newOptionM.id) exist = true;
                    }
                    if (!exist) { deleteOptionMessage(oldOptionM.id); }
                }

                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {

                    foreach (OptionMessage optionM in optionMessages)
                    {
                        //insert new values
                        if (!optionMessageExist(optionM.id))
                        {
                            List<OptionMessage> newOptionMessages = new List<OptionMessage>();
                            newOptionMessages.Add(optionM);
                            insertOptionMessages(optionId, newOptionMessages);
                            newOptionMessages.Clear();
                        }
                        else
                        {
                            //update existing values
                            conn.Open();
                            SqlCommand updateOptionMessage = new SqlCommand("UPDATE [Chatbot].[dbo].[OptionMessage] SET " +
                            "[Chatbot].[dbo].[OptionMessage].[message] = @message, " +
                            "[Chatbot].[dbo].[OptionMessage].[value] = @value " +
                            "where [Chatbot].[dbo].[OptionMessage].[id]= @id", conn);

                            updateOptionMessage.Parameters.AddWithValue("@message", optionM.message);
                            updateOptionMessage.Parameters.AddWithValue("@value", optionM.value);
                            updateOptionMessage.Parameters.AddWithValue("@id", optionM.id);

                            int result = updateOptionMessage.ExecuteNonQuery();
                            conn.Close();
                        }
                    }

                }
                return "Messages d'option modifiés";
            }
        }

        public static string deleteOptionMessage(int optionMessageId)
        {
            if (!optionMessageExist(optionMessageId))
            {
                return "Message d'option n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    SqlCommand deleteOptionMessage = new SqlCommand("DELETE FROM [Chatbot].[dbo].[OptionMessage] where [Chatbot].[dbo].[OptionMessage]" +
                      ".[id]= @id", conn);
                    deleteOptionMessage.Parameters.AddWithValue("@id", optionMessageId);
                    int result = deleteOptionMessage.ExecuteNonQuery();
                    conn.Close();
                }
                return "Message d'option supprimé";
            }
        }
        public static string deleteAllOptionMessages(int optionId)
        {
            if (!OptionDao.optionExist(optionId))
            {
                return "Option n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    SqlCommand deleteOptionMessages = new SqlCommand("DELETE FROM [Chatbot].[dbo].[OptionMessage] where [Chatbot].[dbo].[OptionMessage]" +
                      ".[optionId]= @id", conn);
                    deleteOptionMessages.Parameters.AddWithValue("@id", optionId);
                    int result = deleteOptionMessages.ExecuteNonQuery();
                    conn.Close();
                }
                return "Messages d'option supprimés";
            }
        }
    }
}