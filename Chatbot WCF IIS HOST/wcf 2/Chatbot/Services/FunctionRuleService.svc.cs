using Chatbot.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.ServiceModel;
using System.Text;

namespace Chatbot.Services
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "FunctionRuleService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez FunctionRuleService.svc ou FunctionRuleService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class FunctionRuleService : IFunctionRuleService
    {

        private Connection.Connection connection = new Connection.Connection();
        public string insertFunctionRule()
        {
            FunctionRule functionRule = OperationContext.Current.RequestContext.RequestMessage.GetBody
                <FunctionRule>(new DataContractJsonSerializer(typeof(FunctionRule)));
            string Message;


            if (functionRuleExist(functionRule.functionId, functionRule.ruleId))
            {
                Message = "function rule déja exist";
            }
            else {
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();

                    SqlCommand cmd = new SqlCommand("insert into [Chatbot].[dbo].[FunctionRule] values(@ruleId,@functionId)", conn);
                    cmd.Parameters.AddWithValue("@functionId", functionRule.functionId);
                    cmd.Parameters.AddWithValue("@ruleId", functionRule.ruleId);
                    int result = cmd.ExecuteNonQuery();
                    if (result == 1)
                    {
                        Message = "Function rule ajouté avec succés";
                    }
                    else
                    {
                        Message = "Function rule pas ajouté";
                    }



                    conn.Close();
                }
            }


            




            return Message;
        }












        public string deleteFunctionRule()
        {

            string message;
            FunctionRule functionRule = OperationContext.Current.RequestContext.RequestMessage.GetBody
                <FunctionRule>(new DataContractJsonSerializer(typeof(FunctionRule)));


            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("DELETE FROM [Chatbot].[dbo].[FunctionRule] where [Chatbot].[dbo].[functionRule]" +
                    ".[FunctionId]= @functionId and [Chatbot].[dbo].[functionrule].[ruleId]= @ruleId", conn); 
                cmd.Parameters.AddWithValue("@functionId", functionRule.functionId);
                cmd.Parameters.AddWithValue("@ruleId", functionRule.ruleId);

                int result = cmd.ExecuteNonQuery();



                if (result == 1)
                {
                    message = "suppression avec succés";
                }
                else
                {
                    message = "echec suppression";
                }

                conn.Close();

            }
            return message;

        }







        public List<FunctionRule> getRuleByFunction(int functionId)
        {
            List<FunctionRule> functionRules = new List<FunctionRule>();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[functionRule]" +
                    "where [Chatbot].[dbo].[FunctionRule].[functionId]=@functionId", conn);
                cmd.Parameters.AddWithValue("@functionId", functionId);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    FunctionRule functionRule = new FunctionRule();
                    functionRule.functionId = int.Parse(rdr["functionId"].ToString());
                    functionRule.ruleId = int.Parse(rdr["ruleId"].ToString());
                    functionRules.Add(functionRule);
                    
                }
                conn.Close();
            }
            return functionRules;
        }





        public bool functionRuleExist(int functionId, int ruleId )
        {
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[FunctionRule] where [Chatbot].[dbo].[FunctionRule]" +
                    ".[FunctionId]='" + functionId + "' and [Chatbot].[dbo].[FunctionRule].[RuleId]='" + ruleId + "'", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();

                int i = 0;    
                    
                while (rdr.Read())
                {
                    i++;
                }

                if (i==0)
                {
                    return false;
                }
                else
                {
                    return true; 
                }



                conn.Close();
            }
            
        }


    }
}
