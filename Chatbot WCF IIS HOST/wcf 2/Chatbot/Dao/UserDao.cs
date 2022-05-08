using System;
using System.Collections.Generic;
using System.ServiceModel;
using Chatbot.Models;
using System.Data.SqlClient;
using System.Runtime.Serialization.Json;
using Chatbot.Encryption;

namespace Chatbot.Dao
{
    public class UserDao
    {
        private static string key = "b14ca5898a4e4133bbce2ea2315a1916";
        private static Connection.Connection connection = new Connection.Connection();
        public static List<Employee> getAllEmployees()
        {
            List<Employee> employees = new List<Employee>();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[User] " +
                    "WHERE [Chatbot].[dbo].[User].[UserType] = 'Employe'", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Employee e = new Employee();
                    e.id = int.Parse(rdr["id"].ToString());
                    e.username = rdr["Username"].ToString();
                    e.name = rdr["Name"].ToString();
                    e.lastname = rdr["Lastname"].ToString();
                    e.address = rdr["Address"].ToString();
                    e.telephoneNum = rdr["TelephoneNum"].ToString();
                    e.password = "Mot de passe secret";
                    e.email = rdr["Email"].ToString();
                    e.functionId = getEmployeeFunction(e.id).id;
                    e.userType = rdr["UserType"].ToString();
                    employees.Add(e);
                }
                conn.Close();
            }
            return employees;
        }

        public static Function getEmployeeFunction(int id)
        {
            if (!userExistById(id))
            {
                return null;
            }
            else
            {
                Function function = new Function();
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("SELECT f.* FROM [Chatbot].[dbo].[Function] f, [Chatbot].[dbo].[Employee] e " +
                        "WHERE e.id = @id AND e.FunctionId = f.id", conn);
                    cmd.Parameters.AddWithValue("@id", id);
                    SqlDataReader rdr = cmd.ExecuteReader();
                    while (rdr.Read())
                    {
                        function.id = int.Parse(rdr["id"].ToString());
                        function.title = rdr["Title"].ToString();
                        function.description = rdr["Description"].ToString();
                        function.permissionId = int.Parse(rdr["permissionId"].ToString());
                    }
                    conn.Close();
                }
                return function;
            }
        }

        public static Employee getEmployeeByUsername(string username)
        {
            if (!userExist(username))
            {
                return null;
            }
            else
            {
                Employee e = new Employee();
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[User] where [Chatbot].[dbo].[User]" +
                        ".[Username]= @username", conn);
                    cmd.Parameters.AddWithValue("@username", username);
                    conn.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    string password;
                    while (rdr.Read())
                    {
                        e.id = int.Parse(rdr["id"].ToString());
                        e.username = rdr["Username"].ToString();
                        e.name = rdr["Name"].ToString();
                        e.lastname = rdr["Lastname"].ToString();
                        e.address = rdr["Address"].ToString();
                        e.functionId = getEmployeeFunction(e.id).id;
                        e.telephoneNum = rdr["TelephoneNum"].ToString();
                        password = rdr["Password"].ToString();
                        e.password = AesOperation.DecryptString(key, password);
                        e.email = rdr["Email"].ToString();
                        e.userType = rdr["UserType"].ToString();
                    }
                    conn.Close();
                }
                return e;
            }
        }

        public static Employee getEmployeeById(int id)
        {
            if (!userExistById(id))
            {
                return null;
            }
            else
            {
                Employee e = new Employee();
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[User] where [Chatbot].[dbo].[User]" +
                        ".[id]= @id", conn);
                    cmd.Parameters.AddWithValue("@id", id);
                    conn.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    string password;
                    while (rdr.Read())
                    {
                        e.id = int.Parse(rdr["id"].ToString());
                        e.username = rdr["Username"].ToString();
                        e.name = rdr["Name"].ToString();
                        e.lastname = rdr["Lastname"].ToString();
                        e.address = rdr["Address"].ToString();
                        e.functionId = getEmployeeFunction(e.id).id;
                        e.telephoneNum = rdr["TelephoneNum"].ToString();
                        password = rdr["Password"].ToString();
                        e.password = AesOperation.DecryptString(key, password);
                        e.email = rdr["Email"].ToString();
                        e.userType = rdr["UserType"].ToString();
                    }
                    conn.Close();
                }
                return e;
            }
        }

        public static string insertEmployee(Employee e)
        {
            if (userExist(e.username))
            {
                return e.username + " déja existe";
            }
            else
            {
                string encryptedPassword = AesOperation.EncryptString(key, e.password);


                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    //insert into User
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("insert into [Chatbot].[dbo].[User] values(@userName,@name,@lastName," +
                        "@adresse,@telephoneNum,@password,@email,'Employe')", conn);
                    cmd.Parameters.AddWithValue("@userName", e.username);
                    cmd.Parameters.AddWithValue("@name", e.name);
                    cmd.Parameters.AddWithValue("@lastName", e.lastname);
                    cmd.Parameters.AddWithValue("@adresse", e.address);
                    cmd.Parameters.AddWithValue("@telephoneNum", e.telephoneNum);
                    cmd.Parameters.AddWithValue("@password", encryptedPassword);
                    cmd.Parameters.AddWithValue("@email", e.email);
                    int result = cmd.ExecuteNonQuery();
                    conn.Close();
                    //Select UserId
                    conn.Open();
                    int userId = 0;
                    SqlCommand selectUserId = new SqlCommand("SELECT IDENT_CURRENT('User')", conn);
                    SqlDataReader rdr = selectUserId.ExecuteReader();
                    while (rdr.Read()) { userId = Convert.ToInt32(rdr.GetDecimal(0)); }
                    conn.Close();
                    //insert into Employee
                    if (result == 1)
                    {
                        conn.Open();
                        SqlCommand cmd1 = new SqlCommand("insert into [Chatbot].[dbo].[employee] values(@id,@functionId)", conn);
                        cmd1.Parameters.AddWithValue("@id", userId);
                        cmd1.Parameters.AddWithValue("@functionId", e.functionId);
                        int result1 = cmd1.ExecuteNonQuery();
                        conn.Close();
                        return e.username + " a eté ajouté avec succés";
                    }
                    else
                    {
                        return e.username + " pas ajouté";
                    }
                }
            }
        }

        public static string insertAdministrator(Administrator u)
        {
            if (userExist(u.username))
            {
                return u.username + " déja existe";
            }
            else
            {
                string encryptedPassword = AesOperation.EncryptString(key, u.password);


                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    //insert into User
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("insert into [Chatbot].[dbo].[User] values(@userName,@name,@lastName," +
                        "@adresse,@telephoneNum,@password,@email,'Administrateur')", conn);
                    cmd.Parameters.AddWithValue("@userName", u.username);
                    cmd.Parameters.AddWithValue("@name", u.name);
                    cmd.Parameters.AddWithValue("@lastName", u.lastname);
                    cmd.Parameters.AddWithValue("@adresse", u.address);
                    cmd.Parameters.AddWithValue("@telephoneNum", u.telephoneNum);
                    cmd.Parameters.AddWithValue("@password", encryptedPassword);
                    cmd.Parameters.AddWithValue("@email", u.email);
                    int result = cmd.ExecuteNonQuery();
                    conn.Close();
                    //Select UserId
                    conn.Open();
                    int userId = 0;
                    SqlCommand selectUserId = new SqlCommand("SELECT IDENT_CURRENT('User')", conn);
                    SqlDataReader rdr = selectUserId.ExecuteReader();
                    while (rdr.Read()) { userId = Convert.ToInt32(rdr.GetDecimal(0)); }
                    conn.Close();
                    //insert into Administrator
                    if (result == 1)
                    {
                        conn.Open();
                        SqlCommand cmd1 = new SqlCommand("insert into [Chatbot].[dbo].[Administrator] values(@id)", conn);
                        cmd1.Parameters.AddWithValue("@id", userId);
                        int result1 = cmd1.ExecuteNonQuery();
                        conn.Close();
                        return u.username + " a eté ajouté avec succés";
                    }
                    else
                    {
                        return u.username + " pas ajouté";
                    }
                }
            }
        }



        public static Boolean userExist(string username)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[User] " +
                    "WHERE [Chatbot].[dbo].[User].[username] = @username", conn);
                select.Parameters.AddWithValue("@username", username);
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

        public static Boolean userExistById(int id)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[User] " +
                    "WHERE [Chatbot].[dbo].[User].[id] = @id", conn);
                select.Parameters.AddWithValue("@id", id);
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

        public static Boolean employeeExistById(int id)
        {

            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();
                SqlCommand select = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Employee] " +
                    "WHERE [Chatbot].[dbo].[Employee].[id] = @id", conn);
                select.Parameters.AddWithValue("@id", id);
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



        public static string deleteUser(User u)
        {
            string message;


            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();


                if (u.userType == "Administrateur")
                {
                    SqlCommand deleteAdmin = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Administrator] where [Chatbot].[dbo].[Administrator]" +
                    ".[id]= @userId", conn);
                    deleteAdmin.Parameters.AddWithValue("@userId", u.id);
                    int resultAdmin = deleteAdmin.ExecuteNonQuery();
                }
                else
                {
                    SqlCommand deleteEmployee = new SqlCommand("DELETE FROM [Chatbot].[dbo].[employee] where [Chatbot].[dbo].[employee]" +
                    ".[id]= @userId", conn);
                    deleteEmployee.Parameters.AddWithValue("@userId", u.id);

                    int resultUser = deleteEmployee.ExecuteNonQuery();
                }

                SqlCommand cmd = new SqlCommand("DELETE FROM [Chatbot].[dbo].[MessageHistory] where [Chatbot].[dbo].[MessageHistory]" +
                    ".[UserId]= @userId", conn);
                cmd.Parameters.AddWithValue("@userId", u.id);

                int result = cmd.ExecuteNonQuery();

                SqlCommand cmd1 = new SqlCommand("DELETE FROM [Chatbot].[dbo].[User] where [Chatbot].[dbo].[User]" +
                    ".[id]= @userId", conn);
                cmd1.Parameters.AddWithValue("@userId", u.id);

                int result1 = cmd1.ExecuteNonQuery();

                if (result1 == 1)
                {
                    message = u.username + " a eté supprimé avec succés";
                }
                else
                {
                    message = u.username + " pas supprimé";
                }

                conn.Close();

            }
            return message;

        }




        public static string updateEmployee(Employee e)
        {
            if (!userExistById(e.id))
            {
                return "Utilisateur n'existe pas";
            }
            else
            {

                string encryptedPassword = AesOperation.EncryptString(key, e.password);

                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {

                    conn.Open();
                    SqlCommand cmd = new SqlCommand("update [Chatbot].[dbo].[User] " +
                        "set [Chatbot].[dbo].[User].[Username]=@username, " +
                        "[Chatbot].[dbo].[User].[Name]=@name, " +
                        "[Chatbot].[dbo].[User].[LastName]=@lastName, " +
                        "[Chatbot].[dbo].[User].[address]=@adresse, " +
                        "[Chatbot].[dbo].[User].[telephoneNum]=@telephoneNum, " +
                        "[Chatbot].[dbo].[User].[password]=@password, " +
                        "[Chatbot].[dbo].[User].[email]=@email, " +
                        "[Chatbot].[dbo].[User].[userType]=@userType " +
                        "where [Chatbot].[dbo].[User].[id]=@id", conn);

                    cmd.Parameters.AddWithValue("@id", e.id);
                    cmd.Parameters.AddWithValue("@username", e.username);
                    cmd.Parameters.AddWithValue("@name", e.name);
                    cmd.Parameters.AddWithValue("@lastName", e.lastname);
                    cmd.Parameters.AddWithValue("@adresse", e.address);
                    cmd.Parameters.AddWithValue("@telephoneNum", e.telephoneNum);
                    cmd.Parameters.AddWithValue("@password", encryptedPassword);
                    cmd.Parameters.AddWithValue("@email", e.email);
                    cmd.Parameters.AddWithValue("@userType", e.userType);
                    int result = cmd.ExecuteNonQuery();
                    conn.Close();

                    //Update Employee

                    conn.Open();
                    SqlCommand update = new SqlCommand("update [Chatbot].[dbo].[Employee] " +
                        "SET [Chatbot].[dbo].[Employee].[FunctionId]=@functionId, " +
                        "WHERE [Chatbot].[dbo].[Employee].[id]=@id", conn);

                    cmd.Parameters.AddWithValue("@id", e.id);
                    cmd.Parameters.AddWithValue("@functionId", e.functionId);
                    return e.username + " a eté modifié avec succés";
                }
            }
        }
    }
}