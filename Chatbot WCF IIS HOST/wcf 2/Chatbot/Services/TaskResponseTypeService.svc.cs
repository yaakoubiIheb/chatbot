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
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "TaskResponseTypeService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez TaskResponseTypeService.svc ou TaskResponseTypeService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class TaskResponseTypeService : ITaskResponseTypeService
    {
        private Connection.Connection connection = new Connection.Connection();


        public List<TaskResponseType> getAllTaskResponseType()
        {
            List<TaskResponseType> types = new List<TaskResponseType>();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[taskresponsetype]", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    TaskResponseType type= new TaskResponseType();

                    type.id = int.Parse(rdr["id"].ToString());
                    type.type= rdr["type"].ToString();
                    

                    types.Add(type);
                }
                conn.Close();
            }
            return types;
        }
    }
}
