using Chatbot.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.ServiceModel;
using System.Text;
using Chatbot.Dao;

namespace Chatbot.Services
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "FunctionService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez FunctionService.svc ou FunctionService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class FunctionService : IFunctionService
    {
        private Connection.Connection connection = new Connection.Connection();


        public List<Function> getAllFunction()
        {
            List<Function> functions = new List<Function>();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Function]", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
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
            }
            return functions;
        }

        public Function getFunctionById(int id)
        {

            Function function = new Function();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Function] where [Chatbot].[dbo].[Function]" +
                    ".[id]='" + id + "'", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {


                    function.id = int.Parse(rdr["id"].ToString());
                    function.title = rdr["title"].ToString();
                    function.description = rdr["description"].ToString();
                    function.permissionId = int.Parse(rdr["permissionId"].ToString());

                }
                conn.Close();
            }
            return function;
        }



        public string insertFunction()
        {
            Function function = OperationContext.Current.RequestContext.RequestMessage.GetBody
                <Function>(new DataContractJsonSerializer(typeof(Function)));


            string Message;

            if (functionExist(function.id))
            {
                Message = function.id + " déja existe";
            }
            else
            {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();

                    SqlCommand cmd = new SqlCommand("insert into [Chatbot].[dbo].[Function] values(@title,@description," +
                        "@permissionId)", conn);
                    /*cmd.Parameters.AddWithValue("@id", function.id);*/
                    cmd.Parameters.AddWithValue("@title", function.title);
                    cmd.Parameters.AddWithValue("@description", function.description);
                    cmd.Parameters.AddWithValue("@permissionId", function.permissionId);

                    int result = cmd.ExecuteNonQuery();
                    if (result == 1)
                    {
                        Message = function.title + " a eté ajouté avec succés";
                    }
                    else
                    {
                        Message = function.title + " pas ajouté";
                    }
                    conn.Close();
                }



            }
            return Message;
        }



        public bool functionExist(int id)
        {

            Function function = getFunctionById(id);

            if (function.id < 0)
            {
                return true;
            }
            else
            {
                return false;
            }

        }


        public string deleteFunction()
        {

            string message;
            List<int> employeesId = new List<int>();
            Function function = OperationContext.Current.RequestContext.RequestMessage.GetBody
                <Function>(new DataContractJsonSerializer(typeof(Function)));


            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                Function_RuleDao.deleteFunctionRules(function.id);



                SqlCommand selectemployeeId = new SqlCommand("SELECT id FROM [Chatbot].[dbo].[employee]" +
                   "WHERE [Chatbot].[dbo].[employee].[FunctionID] = @functionId", conn);
                selectemployeeId.Parameters.AddWithValue("@functionId", function.id);
                conn.Open();
                SqlDataReader rdrEmployeeId = selectemployeeId.ExecuteReader();
                while (rdrEmployeeId.Read())
                {

                    employeesId.Add(int.Parse(rdrEmployeeId["id"].ToString()));

                }
                conn.Close();


                foreach (int id in employeesId)
                {
                    User user = new User();
                    user.id = id;
                    user.userType = "employee";
                    UserDao.deleteUser(user);
                }


                conn.Open();
                SqlCommand cmd = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Function] where [Chatbot].[dbo].[Function]" +
                    ".[id]= @id", conn);
                cmd.Parameters.AddWithValue("@id", function.id);

                int result = cmd.ExecuteNonQuery();

                if (result == 1)
                {
                    message = function.title + " a eté supprimé avec succés";
                }
                else
                {
                    message = function.title + " pas supprimé";
                }

                conn.Close();

            }
            return message;

        }




        public string updateFunction()
        {

            string message;
            Function function = OperationContext.Current.RequestContext.RequestMessage.GetBody
                <Function>(new DataContractJsonSerializer(typeof(Function)));


            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("update [Chatbot].[dbo].[Function] " +
                    "set [Chatbot].[dbo].[Function].[title]=@title," +
                    "[Chatbot].[dbo].[Function].[description]=@description," +
                    "[Chatbot].[dbo].[Function].[permissionId]=@permissionId" +
                    " where [Chatbot].[dbo].[Function].[id]=@id", conn);


                cmd.Parameters.AddWithValue("@id", function.id);
                cmd.Parameters.AddWithValue("@title", function.title);
                cmd.Parameters.AddWithValue("@description", function.description);
                cmd.Parameters.AddWithValue("@permissionId", function.permissionId);

                int result = cmd.ExecuteNonQuery();

                if (result == 1)
                {
                    message = function.title + " a eté modifié avec succés";
                }
                else
                {
                    message = function.title + " pas modifié";
                }

                conn.Close();

            }
            return message;

        }
    }
}
