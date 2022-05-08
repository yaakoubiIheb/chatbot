using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Chatbot.Models;
using System.Data.SqlClient;

namespace Chatbot.Dao
{
    public class InputDao
    {
        private static Connection.Connection connection = new Connection.Connection();
        public static List<Input> getAllRuleInputs(int ruleId)
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
                    List<Input> inputs = new List<Input>();
                    SqlCommand selectInputs = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[SequenceMessage], [Chatbot].[dbo].[Input] where " +
                        "[Chatbot].[dbo].[SequenceMessage].[ruleId]=@ruleId AND" +
                        "[Chatbot].[dbo].[input].[id]=[Chatbot].[dbo].[SequenceMessage].[id] AND" +
                        "[Chatbot].[dbo].[SequenceMessage].[sequenceType] = @sequenceType", conn);
                    selectInputs.Parameters.AddWithValue("@ruleId", ruleId);
                    selectInputs.Parameters.AddWithValue("@sequenceType", "saisie");
                    SqlDataReader rdr = selectInputs.ExecuteReader();
                    while (rdr.Read())
                    {
                        Input input = new Input();

                        input.id = int.Parse(rdr["id"].ToString());
                        input.question = rdr["question"].ToString();
                        input.attribute = rdr["attribute"].ToString();
                        input.ruleId = int.Parse(rdr["ruleId"].ToString());
                        input.sequenceType = rdr["sequenceType"].ToString();
                        input.valueType = rdr["valueType"].ToString();
                        input.controlType = rdr["controlType"].ToString();

                        inputs.Add(input);
                    }
                    conn.Close();
                    return inputs;
                }
            }
        }

        public static Boolean inputExist(int inputId)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Input] " +
                    "WHERE [Chatbot].[dbo].[Input].[id] = @inputId", conn);
                select.Parameters.AddWithValue("@inputId", inputId);
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

        public static string insertRuleInputs(int ruleId, List<Input> inputs)
        {
            if (!RuleDao.ruleExistById(ruleId))
            {
                return "Régle n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    foreach (Input input in inputs)
                    {
                        //Insert into Sequence Message
                        conn.Open();
                        SqlCommand insertSequenceMessage = new SqlCommand("insert into [Chatbot].[dbo].[SequenceMessage] values(@question,@attribute,@ruleId,@sequenceType)", conn);
                        insertSequenceMessage.Parameters.AddWithValue("@question", input.question);
                        insertSequenceMessage.Parameters.AddWithValue("@attribute", input.attribute);
                        insertSequenceMessage.Parameters.AddWithValue("@ruleId", ruleId);
                        insertSequenceMessage.Parameters.AddWithValue("@sequenceType", input.sequenceType);
                        int resultSequenceMessage = insertSequenceMessage.ExecuteNonQuery();
                        conn.Close();
                        //Select Input Id
                        conn.Open();
                        int inputId = 0;
                        SqlCommand selectInputId = new SqlCommand("SELECT IDENT_CURRENT('SequenceMessage')", conn);
                        SqlDataReader rdr = selectInputId.ExecuteReader();
                        while (rdr.Read()) { inputId = Convert.ToInt32(rdr.GetDecimal(0)); }
                        conn.Close();

                        //Insert Into Input
                        conn.Open();
                        SqlCommand insertInput = new SqlCommand("insert into [Chatbot].[dbo].[Input] values(@inputId,@valueType,@controlType)", conn);
                        insertInput.Parameters.AddWithValue("@inputId", inputId);
                        insertInput.Parameters.AddWithValue("@valueType", input.valueType);
                        insertInput.Parameters.AddWithValue("@controlType", input.controlType);
                        int result = insertInput.ExecuteNonQuery();
                        conn.Close();
                    }
                }
                return "Sequences Saisies ajoutées avec succès";
            }

        }

        public static string updateRuleInputs(int ruleId, List<Input> inputs)
        {
            if (!RuleDao.ruleExistById(ruleId))
            {
                return "Régle n'existe pas";
            }
            else
            {
                //delete Old values
                List<Input> oldInputs = getAllRuleInputs(ruleId);
                foreach (Input oldInput in oldInputs)
                {
                    bool exist = false;
                    foreach (Input newInput in inputs)
                    {
                        if (oldInput.id == newInput.id) exist = true;
                    }
                    if (!exist) { deleteInput(oldInput.id); }
                }
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {

                    foreach (Input input in inputs)
                    {
                        //insert new values
                        if (!inputExist(input.id))
                        {
                            List<Input> newInputs = new List<Input>();
                            newInputs.Add(input);
                            insertRuleInputs(ruleId, newInputs);
                            newInputs.Clear();
                        }
                        else
                        {
                            //update SequenceMessage
                            conn.Open();
                            SqlCommand updateSequenceMessage = new SqlCommand("UPDATE [Chatbot].[dbo].[SequenceMessage] SET" +
                        "[Chatbot].[dbo].[SequenceMessage].[question] = @question, " +
                        "[Chatbot].[dbo].[SequenceMessage].[attribute] = @attribute, " +
                        "[Chatbot].[dbo].[SequenceMessage].[ruleId] = @ruleId, " +
                        "[Chatbot].[dbo].[SequenceMessage].[sequenceType] = @sequenceType " +
                        "where [Chatbot].[dbo].[SequenceMessage].[id]= @id", conn);

                            updateSequenceMessage.Parameters.AddWithValue("@question", input.question);
                            updateSequenceMessage.Parameters.AddWithValue("@attribute", input.attribute);
                            updateSequenceMessage.Parameters.AddWithValue("@ruleId", ruleId);
                            updateSequenceMessage.Parameters.AddWithValue("@SequenceType", input.sequenceType);
                            updateSequenceMessage.Parameters.AddWithValue("@id", input.id);

                            int result = updateSequenceMessage.ExecuteNonQuery();
                            conn.Close();

                            //update Input
                            conn.Open();
                            SqlCommand updateInput = new SqlCommand("UPDATE [Chatbot].[dbo].[input] SET" +
                        "[Chatbot].[dbo].[Input].[valueType] = @valueType, [Chatbot].[dbo].[Input].[controlType] = @controlType " +
                        "WHERE [Chatbot].[dbo].[Input].[id]= @id", conn);
                            updateSequenceMessage.Parameters.AddWithValue("@id", input.id);
                            updateSequenceMessage.Parameters.AddWithValue("@valueType", input.valueType);
                            updateSequenceMessage.Parameters.AddWithValue("@controlType", input.controlType);

                            int result2 = updateInput.ExecuteNonQuery();
                            conn.Close();
                        }
                    }
                }
                return "Sequences Saisies modifées avec succès";
            }

        }
        public static string deleteInput(int inputId)
        {
            if (!inputExist(inputId))
            {
                return "Séquence Saisie n'existe pas";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    //delete from Input
                    conn.Open();
                    SqlCommand deleteInput = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Input] where [Chatbot].[dbo].[Input]" +
                      ".[id]= @id", conn);
                    deleteInput.Parameters.AddWithValue("@id", inputId);
                    int result1 = deleteInput.ExecuteNonQuery();
                    conn.Close();
                    //Delete From SequenceMessage
                    conn.Open();
                    SqlCommand deleteSequenceMessage = new SqlCommand("DELETE FROM [Chatbot].[dbo].[SequenceMessage] where [Chatbot].[dbo].[SequenceMessage]" +
                      ".[id]= @id", conn);
                    deleteSequenceMessage.Parameters.AddWithValue("@id", inputId);
                    int result2 = deleteSequenceMessage.ExecuteNonQuery();
                    conn.Close();
                }
                return "Sequence Saisie supprimée avec succès";
            }
        }

        public static string deleteAllRuleInputs(int ruleId)
        {
            if (!RuleDao.ruleExistById(ruleId))
            {
                return "Régle n'existe pas";
            }
            else
            {
                List<Input> inputs = getAllRuleInputs(ruleId);
                foreach (Input input in inputs)
                {
                    deleteInput(input.id);
                }
                return "Sequences Saisies supprimées avec succès";
            }
        }
    }
}