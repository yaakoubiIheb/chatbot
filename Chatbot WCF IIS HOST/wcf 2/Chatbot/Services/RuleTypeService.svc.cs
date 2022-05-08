using Chatbot.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace Chatbot.Services
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "RuleTypeService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez RuleTypeService.svc ou RuleTypeService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class RuleTypeService : IRuleTypeService
    {
        private Connection.Connection connection = new Connection.Connection();


        public List<RuleType> getAllRuleType()
        {
            List<RuleType> types = new List<RuleType>();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[ruletype]", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    RuleType type = new RuleType();

                    type.id = int.Parse(rdr["id"].ToString());
                    type.type = rdr["type"].ToString();


                    types.Add(type);
                }
                conn.Close();
            }
            return types;
        }
    }
}
