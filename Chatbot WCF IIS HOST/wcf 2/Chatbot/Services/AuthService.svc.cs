using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using Chatbot.Models;
using Chatbot.Connection;
using System.ServiceModel.Activation;
using System.Data.SqlClient;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using System.Runtime.Serialization.Json;
using Chatbot.Services;
using Newtonsoft.Json;
using Chatbot.JWT;
using Chatbot.Dao;
using Chatbot.Encryption;


namespace Chatbot.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "AuthService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select AuthService.svc or AuthService.svc.cs at the Solution Explorer and start debugging.
    public class AuthService : IAuthService
    {
        private string key = "b14ca5898a4e4133bbce2ea2315a1916";
        private static Connection.Connection connection = new Connection.Connection();

        public string signIn()
        {
            User userToValidate = OperationContext.Current.RequestContext.RequestMessage.GetBody<User>(new DataContractJsonSerializer(typeof(User)));
            UserService userService = new UserService();
            if (!UserDao.userExist(userToValidate.username)) return "Cet Utilisateur n'existe pas";
            User user = getUser(userToValidate.username);
            if (userToValidate.password == user.password)
            {
                var serializer = new JavaScriptSerializer();
                return serializer.Serialize(new
                {
                    id = user.id,
                    username = user.username,
                    name = user.name,
                    lastname = user.lastname,
                    email = user.email,
                    address = user.address,
                    userType = user.userType,
                    telephoneNum = user.telephoneNum,
                    accessToken = JwtToken.generateToken(user.username),
                });
            }
            else
            {
                return "Mot de passe incorrect";
            }
        }

        public User getUser(string username)
        {
            if (!UserDao.userExist(username))
            {
                return null;
            }
            else
            {
                User u = new User();
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[User]" +
                        "WHERE [Chatbot].[dbo].[User].[Username] = @username", conn);
                    select.Parameters.AddWithValue("@username", username);
                    conn.Open();
                    SqlDataReader rdr = select.ExecuteReader();

                    string password;

                    while (rdr.Read())
                    {
                        u.id = int.Parse(rdr["id"].ToString());
                        u.username = rdr["Username"].ToString();
                        u.name = rdr["Name"].ToString();
                        u.lastname = rdr["Lastname"].ToString();
                        u.address = rdr["Address"].ToString();
                        u.telephoneNum = rdr["TelephoneNum"].ToString();
                        password = rdr["Password"].ToString();
                        u.password = AesOperation.DecryptString(key, password);
                        u.email = rdr["Email"].ToString();
                        u.userType = rdr["UserType"].ToString();
                    }
                    conn.Close();
                }
                return u;
            }
        }
    }
}
