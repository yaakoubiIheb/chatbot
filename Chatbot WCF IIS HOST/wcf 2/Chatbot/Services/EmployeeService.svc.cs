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
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "EmployeeService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez EmployeeService.svc ou EmployeeService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class EmployeeService : IEmployeeService
    {
        private Connection.Connection connection = new Connection.Connection();
        /*public List<Employee> getAllEmployee()
        {
            List<Employee> employees = new List<Employee>();
            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [Chatbot].[dbo].[Employee]", conn);
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Employee employee= new Employee();
                    employee.username = rdr["Username"].ToString();
                    employee.functionId = int.Parse(rdr["functionId"].ToString());
                    employees.Add(employee);
                }
                conn.Close();
            }
            return employees;
        }*/
    }
}
