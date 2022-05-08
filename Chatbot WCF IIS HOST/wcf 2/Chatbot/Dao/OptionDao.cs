using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Chatbot.Models;
using System.Data.SqlClient;

namespace Chatbot.Dao
{
    public class OptionDao
    {
        private static Connection.Connection connection = new Connection.Connection();

        public static List<Option> getAllRuleOptions(int ruleId)
        {
            if (!TaskDao.taskExistById(ruleId))
            {
                return null;
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    List<Option> options = new List<Option>();
                    SqlCommand selectOption = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[SequenceMessage] where " +
                        "[Chatbot].[dbo].[SequenceMessage].[ruleId]=@ruleId AND" +
                        "[Chatbot].[dbo].[SequenceMessage].[sequenceType] = @sequenceType", conn);
                    selectOption.Parameters.AddWithValue("@ruleId", ruleId);
                    selectOption.Parameters.AddWithValue("@sequenceType", "options");
                    SqlDataReader rdrOption = selectOption.ExecuteReader();
                    while (rdrOption.Read())
                    {
                        Option option = new Option();

                        option.id = int.Parse(rdrOption["id"].ToString());
                        option.question = rdrOption["question"].ToString();
                        option.attribute = rdrOption["attribute"].ToString();
                        option.ruleId = int.Parse(rdrOption["ruleId"].ToString());
                        option.sequenceType = rdrOption["sequenceType"].ToString();
                        option.optionMessages = OptionMessageDao.getAllSequenceOptionMessages(option.id);

                        options.Add(option);
                    }
                    conn.Close();
                    return options;
                }
            }
        }
        public static Boolean optionExist(int optionId)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Option] " +
                    "WHERE [Chatbot].[dbo].[Option].[id] = @optionId", conn);
                select.Parameters.AddWithValue("@optionId", optionId);
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

        public static string insertRuleOptions(int ruleId, List<Option> options)
        {
            if (!TaskDao.taskExistById(ruleId))
            {
                return "Tache n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    foreach (Option option in options)
                    {
                        //Insert into Sequence message
                        conn.Open();
                        SqlCommand insertSequenceMessage = new SqlCommand("insert into [Chatbot].[dbo].[SequenceMessage] values(@question,@attribute,@ruleId,@sequenceType)", conn);
                        insertSequenceMessage.Parameters.AddWithValue("@question", option.question);
                        insertSequenceMessage.Parameters.AddWithValue("@attribute", option.attribute);
                        insertSequenceMessage.Parameters.AddWithValue("@ruleId", ruleId);
                        insertSequenceMessage.Parameters.AddWithValue("@sequenceType", option.sequenceType);

                        int resultSequenceMessage = insertSequenceMessage.ExecuteNonQuery();
                        conn.Close();
                        //Select Option Id
                        conn.Open();
                        int optionId = 0;
                        SqlCommand selectOptionId = new SqlCommand("SELECT IDENT_CURRENT('SequenceMessage')", conn);

                        SqlDataReader rdr = selectOptionId.ExecuteReader();
                        while (rdr.Read()) { optionId = Convert.ToInt32(rdr.GetDecimal(0)); }
                        conn.Close();


                        //Insert Into Option
                        conn.Open();
                        SqlCommand insertOption = new SqlCommand("insert into [Chatbot].[dbo].[Option] values(@optionId)", conn);
                        insertOption.Parameters.AddWithValue("@optionId", optionId);
                        int resultOption = insertOption.ExecuteNonQuery();
                        conn.Close();
                        //Insert Into OptionMessages
                        OptionMessageDao.insertOptionMessages(optionId, option.optionMessages);
                    }
                }
                return "options Ajoutées";
            }

        }

        public static string updateRuleOptions(int ruleId, List<Option> options)
        {

            if (!TaskDao.taskExistById(ruleId))
            {
                return "Tache n'existe pas";
            }
            else
            {
                //delete Old values
                List<Option> oldOptions = getAllRuleOptions(ruleId);
                foreach (Option oldOption in oldOptions)
                {
                    bool exist = false;
                    foreach (Option newOption in options)
                    {
                        if (oldOption.id == newOption.id) exist = true;
                    }
                    if (!exist) { deleteOption(oldOption.id); }
                }
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {

                    foreach (Option option in options)
                    {
                        //insert new values
                        if (!optionExist(option.id))
                        {
                            List<Option> newOptions = new List<Option>();
                            newOptions.Add(option);
                            insertRuleOptions(ruleId, newOptions);
                            newOptions.Clear();
                        }
                        else
                        {
                            //update existing values
                            conn.Open();
                            SqlCommand updateOption = new SqlCommand("UPDATE [Chatbot].[dbo].[SequenceMessage] SET" +
                        "[Chatbot].[dbo].[SequenceMessage].[question] = @question, " +
                        "[Chatbot].[dbo].[SequenceMessage].[attribute] = @attribute, " +
                        "[Chatbot].[dbo].[SequenceMessage].[ruleId] = @ruleId, " +
                        "[Chatbot].[dbo].[SequenceMessage].[sequenceType] = @sequenceType " +
                        "where [Chatbot].[dbo].[SequenceMessage].[id]= @id", conn);

                            updateOption.Parameters.AddWithValue("@question", option.question);
                            updateOption.Parameters.AddWithValue("@attribute", option.attribute);
                            updateOption.Parameters.AddWithValue("@ruleId", ruleId);
                            updateOption.Parameters.AddWithValue("@SequenceType", option.sequenceType);
                            updateOption.Parameters.AddWithValue("@id", option.id);

                            int result = updateOption.ExecuteNonQuery();
                            conn.Close();
                            OptionMessageDao.updateOptionMessages(option.id, option.optionMessages);
                        }

                    }

                }
                return "options modifées";

            }
        }

        public static string deleteOption(int optionId)
        {
            if (!OptionDao.optionExist(optionId))
            {
                return "Option n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    //delete all Option messages
                    OptionMessageDao.deleteAllOptionMessages(optionId);
                    //delete from Option
                    conn.Open();
                    SqlCommand deleteOption = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Option] where [Chatbot].[dbo].[Option]" +
                      ".[id]= @id", conn);
                    deleteOption.Parameters.AddWithValue("@id", optionId);
                    int result1 = deleteOption.ExecuteNonQuery();
                    conn.Close();
                    //Delete From SequenceMessage
                    conn.Open();
                    SqlCommand deleteSequenceMessage = new SqlCommand("DELETE FROM [Chatbot].[dbo].[SequenceMessage] where [Chatbot].[dbo].[SequenceMessage]" +
                      ".[id]= @id", conn);
                    deleteSequenceMessage.Parameters.AddWithValue("@id", optionId);
                    int result2 = deleteSequenceMessage.ExecuteNonQuery();
                    conn.Close();
                }
                return "Option supprimée";
            }
        }

        public static string deleteAllRuleOptions(int ruleId)
        {
            if (!TaskDao.taskExistById(ruleId))
            {
                return "Tache n'existe pas";
            }
            else
            {
                List<Option> options = getAllRuleOptions(ruleId);
                foreach (Option option in options)
                {
                    deleteOption(option.id);
                }
                return "Options supprimées";
            }
        }
    }
}