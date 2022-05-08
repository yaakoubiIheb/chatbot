using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using Chatbot.Models;

namespace Chatbot.Dao
{
    public class SequenceMessageDao
    {
        private static Connection.Connection connection = new Connection.Connection();
        public static Boolean SequenceMessageExist(int sequenceMessageId)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[SequenceMessage] " +
                    "WHERE [Chatbot].[dbo].[SequenceMessage].[id] = @sequenceMessageId", conn);
                select.Parameters.AddWithValue("@sequenceMessageId", sequenceMessageId);
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