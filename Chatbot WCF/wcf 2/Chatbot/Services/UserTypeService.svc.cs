using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using Chatbot.Models;

namespace Chatbot.Services
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "UserTypeService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez UserTypeService.svc ou UserTypeService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class UserTypeService : IUserTypeService

    {
        private Connection.Connection connection = new Connection.Connection();
        
        
        public List<UserType> getAllUserType()
        {
            List<UserType> users = new List<UserType>();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[UserType]", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    UserType usertype = new UserType();

                    usertype.id = int.Parse(rdr["id"].ToString());
                    usertype.type = rdr["type"].ToString();
                    
                    users.Add(usertype);
                }
                conn.Close();
            }
            return users;
        }

        public UserType getUserTypeById(int id)
        {

            UserType usertype = new UserType();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[UserType] where [Chatbot].[dbo].[UserType]" +
                    ".[id]='" + id + "'", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {

                    
                    usertype.id= int.Parse(rdr["id"].ToString());
                    usertype.type= rdr["type"].ToString();


                }
                conn.Close();
            }
            return usertype;
        }
    }
}
