using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Chatbot.Models;
using System.Data.SqlClient;

namespace Chatbot.Dao
{
    public class TaskDao
    {
        private static Connection.Connection connection = new Connection.Connection();
        public static List<Task> getAllTasks()
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                List<Task> tasks = new List<Task>();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule], [Chatbot].[dbo].[Task] " +
                    "WHERE [Chatbot].[dbo].[Rule].[RuleType] = @ruleType AND " +
                    "[Chatbot].[dbo].[Rule].[id] = [Chatbot].[dbo].[Task].[id]", conn);
                select.Parameters.AddWithValue("@ruleType", "Tache");
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

        public static Boolean taskExistByTitle(string title)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Task], [Chatbot].[dbo].[Rule] " +
                    "WHERE [Chatbot].[dbo].[Task].[id] = [Chatbot].[dbo].[Rule].[id] AND " +
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

        public static Boolean taskExistById(int taskId)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Task] " +
                    "WHERE [Chatbot].[dbo].[Task].[id] = @taskId", conn);
                select.Parameters.AddWithValue("@taskId", taskId);
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

        public static Task getTaskByTitle(string title)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule], [Chatbot].[dbo].[Task] " +
                    "WHERE [Chatbot].[dbo].[Rule].[title] = @title AND " +
                    "[Chatbot].[dbo].[Rule].[id] = [Chatbot].[dbo].[Task].[id]", conn);
                select.Parameters.AddWithValue("@title", title);
                SqlDataReader rdr = select.ExecuteReader();
                Task task = new Task();
                while (rdr.Read())
                {

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

                }
                conn.Close();
                return task;
            }
        }



        public static void insertTask(Task task)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {

                //Insert into Rule
                conn.Open();
                SqlCommand insertRule = new SqlCommand("insert into [Chatbot].[dbo].[Rule] values(@title,@description,@ruleType)", conn);
                insertRule.Parameters.AddWithValue("@title", task.title);
                insertRule.Parameters.AddWithValue("@description", task.description);
                insertRule.Parameters.AddWithValue("@ruleType", task.ruleType);

                int resultRule = insertRule.ExecuteNonQuery();
                conn.Close();

                //Select Task Id
                conn.Open();
                int taskId = 0;
                SqlCommand selectTaskId = new SqlCommand("SELECT IDENT_CURRENT('Rule')", conn);

                SqlDataReader rdr = selectTaskId.ExecuteReader();
                while (rdr.Read()) { taskId = Convert.ToInt32(rdr.GetDecimal(0)); }
                conn.Close();

                //Insert Into Task
                conn.Open();
                SqlCommand insertTask = new SqlCommand("insert into [Chatbot].[dbo].[Task] values(@id,@method,@api,@responseType,@graphType)", conn);
                insertTask.Parameters.AddWithValue("@id", taskId);
                insertTask.Parameters.AddWithValue("@method", task.method);
                insertTask.Parameters.AddWithValue("@api", task.api);
                insertTask.Parameters.AddWithValue("@responseType", task.responseType);
                insertTask.Parameters.AddWithValue("@graphType", task.graphType);
                int resultConversation = insertTask.ExecuteNonQuery();
                conn.Close();
                //Insert triggers
                TriggerDao.insertRuleTriggers(taskId, task.triggers);
                //Insert Sequence Messages
                List<Option> options = new List<Option>();
                List<Input> inputs = new List<Input>();
                foreach (Object sequenceM in task.sequenceMessages)
                {
                    if (sequenceM is Option) options.Add((Option)sequenceM);
                    if (sequenceM is Input) inputs.Add((Input)sequenceM);
                }
                OptionDao.insertRuleOptions(taskId, options);
                InputDao.insertRuleInputs(taskId, inputs);
            }
        }

        public static void updateTask(Task task)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                //update Rule
                conn.Open();
                SqlCommand updateRule = new SqlCommand("UPDATE [Chatbot].[dbo].[Rule] SET " +
            "[Chatbot].[dbo].[Rule].[title] = @title, " +
            "[Chatbot].[dbo].[Rule].[description] = @description " +
            "WHERE [Chatbot].[dbo].[Rule].[id]= @id", conn);
                updateRule.Parameters.AddWithValue("@title", task.title);
                updateRule.Parameters.AddWithValue("@description", task.description);
                updateRule.Parameters.AddWithValue("@id", task.id);
                int resultRule = updateRule.ExecuteNonQuery();
                conn.Close();
                //update Task
                conn.Open();
                SqlCommand updateTask = new SqlCommand("UPDATE [Chatbot].[dbo].[Task] SET " +
           "[Chatbot].[dbo].[Task].[method] = @method, " +
           "[Chatbot].[dbo].[Task].[api] = @api, " +
           "[Chatbot].[dbo].[Task].[responseType] = @responseType, " +
           "[Chatbot].[dbo].[Task].[graphType] = @graphType " +
           "WHERE [Chatbot].[dbo].[Task].[id]= @id", conn);
                updateTask.Parameters.AddWithValue("@method", task.method);
                updateTask.Parameters.AddWithValue("@api", task.api);
                updateTask.Parameters.AddWithValue("@responseType", task.responseType);
                updateTask.Parameters.AddWithValue("@graphType", task.graphType);
                updateTask.Parameters.AddWithValue("@id", task.id);
                int resultTask = updateTask.ExecuteNonQuery();
                conn.Close();
                //update Triggers
                TriggerDao.updateRuleTriggers(task.id, task.triggers);
                //update sequenceMessages
                List<Option> options = new List<Option>();
                List<Input> inputs = new List<Input>();
                foreach (Object sequenceM in task.sequenceMessages)
                {
                    if (sequenceM is Option) options.Add((Option)sequenceM);
                    if (sequenceM is Input) inputs.Add((Input)sequenceM);
                }
                OptionDao.updateRuleOptions(task.id, options);
                InputDao.updateRuleInputs(task.id, inputs);
            }

        }
        public static void deleteTask(int taskId)
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {

                //Delete Triggers
                TriggerDao.deleteRuleTriggers(taskId);
                //Delete Sequence Messages
                OptionDao.deleteAllRuleOptions(taskId);
                InputDao.deleteAllRuleInputs(taskId);


                //delete From Task
                conn.Open();
                SqlCommand deleteTask = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Task] where [Chatbot].[dbo].[Task]" +
                  ".[id]= @id", conn);
                deleteTask.Parameters.AddWithValue("@id", taskId);
                int result1 = deleteTask.ExecuteNonQuery();
                conn.Close();
                //Delete From Function_Rule
                Function_RuleDao.deleteRuleFunctions(taskId);
                //Delete From History
                Rule rule = RuleDao.getRuleById(taskId);
                HistoryDao.deleteAllRuleHistory(rule.title);
                //Delete From Rule
                conn.Open();
                SqlCommand deleteRule = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Rule] where [Chatbot].[dbo].[Rule]" +
                  ".[id]= @id", conn);
                deleteRule.Parameters.AddWithValue("@id", taskId);
                int result2 = deleteRule.ExecuteNonQuery();
                conn.Close();
            }
        }

    }
}