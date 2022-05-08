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
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "AdministratorService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez AdministratorService.svc ou AdministratorService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class AdministratorService : IAdministratorService
    {
        private Connection.Connection connection = new Connection.Connection();
        public List<Administrator> getAllAdministrator()
        {
            List<Administrator> administrators = new List<Administrator>();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Administrator]", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Administrator administrator = new Administrator();
                    administrator.username = rdr["Username"].ToString();
                    administrators.Add(administrator);
                }
                conn.Close();
            }
            return administrators;
        }
    }
}
