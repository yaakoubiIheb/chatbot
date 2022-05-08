using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Chatbot.Models;
using System.Data.SqlClient;

namespace Chatbot.Dao
{
    public class HistoryDao
    {
        private static Connection.Connection connection = new Connection.Connection();

        public static List<History> getUserHistory(int userId, string date)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                List<History> histories = new List<History>();
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[MessageHistory] " +
                    "WHERE [Chatbot].[dbo].[MessageHistory].[UserId]=@userId AND " +
                    "[Chatbot].[dbo].[MessageHistory].[Date] LIKE @date " +
                    "ORDER BY [Chatbot].[dbo].[MessageHistory].[date] desc", conn);
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.Parameters.AddWithValue("@date", "%" + date + "%");
                SqlDataReader rdr = cmd.ExecuteReader();
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

        public static List<History> getAllUsersHistory(string date)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                List<History> histories = new List<History>();
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[MessageHistory] " +
                    "WHERE [Chatbot].[dbo].[MessageHistory].[Date] LIKE @date " +
                    "ORDER BY [Chatbot].[dbo].[MessageHistory].[date] desc", conn);
                cmd.Parameters.AddWithValue("@date", "%" + date + "%");
                SqlDataReader rdr = cmd.ExecuteReader();
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
        public static List<History> getLast50Message(string username)
        {
            List<History> histories = new List<History>();
            int compteur = 0;
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[MessageHistory]" +
                    "where [Chatbot].[dbo].[MessageHistory].[userId]=@username" +
                    " order by [Chatbot].[dbo].[MessageHistory].[id] desc", conn);
                cmd.Parameters.AddWithValue("@userName", username);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read() && compteur < 51)
                {
                    History history = new History();
                    history.id = int.Parse(rdr["id"].ToString());
                    history.message = rdr["message"].ToString();
                    history.date = rdr["date"].ToString();
                    history.userId = int.Parse(rdr["userId"].ToString());
                    history.ruleTitle = rdr["RuleTitle"].ToString();
                    histories.Add(history);
                    compteur++;
                }
                conn.Close();
            }
            return histories;
        }

        public static string insertHistory(History history)
        {
            if (!UserDao.employeeExistById(history.userId)) { return "Employe n'existe pas"; }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    if (history.ruleTitle == "pas de reponse") history.ruleTitle = "";
                    SqlCommand cmd = new SqlCommand("insert into [Chatbot].[dbo].[MessageHistory] values(@message,@date," +
                    "@userId,@ruleTitle)", conn);
                    cmd.Parameters.AddWithValue("@userId", history.userId);
                    cmd.Parameters.AddWithValue("@message", history.message);
                    cmd.Parameters.AddWithValue("@date", history.date);
                    cmd.Parameters.AddWithValue("@ruleTitle", history.ruleTitle);
                    int result = cmd.ExecuteNonQuery();
                    conn.Close();

                    return "history a eté ajouté avec succés";


                }
            }
        }




        public static string deleteAllUserHistory(int userId)
        {


            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("DELETE FROM [Chatbot].[dbo].[MessageHistory] where [Chatbot].[dbo].[MessageHistory]" +
                    ".[UserId]= @id", conn);
                cmd.Parameters.AddWithValue("@id", userId);

                int result = cmd.ExecuteNonQuery();
                conn.Close();
            }
            return "l'historique a eté supprimé avec succés";

        }

        public static string deleteAllRuleHistory(string ruleTitle)
        {


            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("DELETE FROM [Chatbot].[dbo].[MessageHistory] where [Chatbot].[dbo].[MessageHistory]" +
                    ".[RuleTitle]= @ruleTitle", conn);
                cmd.Parameters.AddWithValue("@ruleTitle", ruleTitle);

                int result = cmd.ExecuteNonQuery();
                conn.Close();
            }
            return "l'historique a eté supprimé avec succés";

        }


        public static string deleteHistoryById(int historyId)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("DELETE FROM [Chatbot].[dbo].[MessageHistory] where [Chatbot].[dbo].[MessageHistory]" +
                    ".[id]= @id", conn);
                cmd.Parameters.AddWithValue("@id", historyId);
                int result = cmd.ExecuteNonQuery();
                conn.Close();
            }
            return "le message a eté supprimé avec succés";

        }
    }
}