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
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "PermissionService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez PermissionService.svc ou PermissionService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class PermissionService : IPermissionService
    {
        private Connection.Connection connection = new Connection.Connection();


        public List<Permission> getAllPermission()
        {
            List<Permission> permissions = new List<Permission>();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Permission]", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Permission permission = new Permission();

                    permission.id = int.Parse(rdr["id"].ToString());
                    permission.title = rdr["title"].ToString();
                    permission.description = rdr["description"].ToString();

                    permissions.Add(permission);
                }
                conn.Close();
            }
            return permissions;
        }

        public Permission getPermissionById(int id)
        {

            Permission permission = new Permission();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Permission] where [Chatbot].[dbo].[Permission]" +
                    ".[id]='" + id + "'", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {


                    permission.id = int.Parse(rdr["id"].ToString());
                    permission.title = rdr["title"].ToString();
                    permission.description = rdr["description"].ToString();


                }
                conn.Close();
            }
            return permission;
        }
    }
}
