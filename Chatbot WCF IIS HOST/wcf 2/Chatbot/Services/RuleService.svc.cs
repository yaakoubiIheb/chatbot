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
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "RuleService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez RuleService.svc ou RuleService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class RuleService : IRuleService
    {
        private Connection.Connection connection = new Connection.Connection();
        public Rule getRuleByTitle(string title)
        {
            return RuleDao.getRuleByTitle(title);
        }

        public List<Rule> autocomplete(string message, int functionId)
        {
            return RuleDao.autocomplete(message, functionId);
        }
        public List<Rule> getAllRules()
        {
            return RuleDao.getAllRules();
        }

        public bool ruleExist(string title)
        {
            return RuleDao.ruleExist(title);
        }

        public List<Rule> getAllRulesByFunction(string functionId)
        {
            List<string> rulesId = new List<string>();
            List<Rule> rules = new List<Rule>();


            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand selectRuleId = new SqlCommand("SELECT RuleID FROM [Chatbot].[dbo].[Function_Rule]" +
                    "WHERE [Chatbot].[dbo].[Function_Rule].[FunctionID] = @functionId", conn);
                selectRuleId.Parameters.AddWithValue("@functionId", functionId);
                conn.Open();
                SqlDataReader rdrRuleId = selectRuleId.ExecuteReader();
                while (rdrRuleId.Read())
                {

                    rulesId.Add(rdrRuleId["RuleID"].ToString());

                }
                conn.Close();



                foreach (string id in rulesId)
                {
                    Rule rule = new Rule();
                    conn.Open();
                    SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Rule] " +
                        "WHERE [Chatbot].[dbo].[Rule].[id] = @id", conn);
                    select.Parameters.AddWithValue("@id", id);
                    SqlDataReader rdr = select.ExecuteReader();
                    while (rdr.Read())
                    {
                        rule.id = int.Parse(rdr["id"].ToString());
                        rule.title = rdr["title"].ToString();
                        rule.description = rdr["description"].ToString();
                        rule.ruleType = rdr["ruleType"].ToString();
                        rule.triggers = TriggerDao.getAllRuleTriggers(rule.id);
                    }
                    rules.Add(rule);
                    conn.Close();
                }

            }
            return rules;

        }



        public List<string> getAllRulesTitles()
        {
            List<string> rules = new List<string>();


            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand selectRule = new SqlCommand("SELECT title FROM [Chatbot].[dbo].[rule]", conn);
                conn.Open();
                SqlDataReader rdrRule = selectRule.ExecuteReader();
                while (rdrRule.Read())
                {



                    rules.Add(rdrRule["title"].ToString());


                }
                conn.Close();

            }

            return rules;

        }
    }
}
