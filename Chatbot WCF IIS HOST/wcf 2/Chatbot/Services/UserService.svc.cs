using System;
using System.Web;
using System.Collections.Generic;
using Chatbot.Models;
using System.ServiceModel.Activation;
using Chatbot.Dao;
using System.ServiceModel;
using System.Runtime.Serialization.Json;
using System.Linq;
using Chatbot.JWT;

namespace Chatbot.Services
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "UserService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez UserService.svc ou UserService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    [AspNetCompatibilityRequirements(
        RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UserService : IUserService
    {
        public List<Employee> getAllEmployees()
        {
            IEnumerable<string> headerValues = HttpContext.Current.Request.Headers.GetValues("accessToken");
            string token = headerValues?.FirstOrDefault();
            if (JwtToken.isTokenValid(token))
            {
                return UserDao.getAllEmployees();
            }
            else
            {
                return null;
            }
        }
        public Boolean userExistByUsername(string username)
        {
            return UserDao.userExist(username);
        }
        public Employee getEmployeeByUsername(string username)
        {
            return UserDao.getEmployeeByUsername(username);
        }

        public Employee getEmployeeById(int id)
        {
            return UserDao.getEmployeeById(id);
        }

        public Function getEmployeeFunction(int id)
        {
            return UserDao.getEmployeeFunction(id);
        }

        public string insertEmployee()
        {
            Employee employee = OperationContext.Current.RequestContext.RequestMessage.GetBody<Employee>(new DataContractJsonSerializer(typeof(Employee)));
            return UserDao.insertEmployee(employee);
        }

        public string insertAdministrator()
        {
            Administrator administrator = OperationContext.Current.RequestContext.RequestMessage.GetBody<Administrator>(new DataContractJsonSerializer(typeof(Administrator)));
            return UserDao.insertAdministrator(administrator);
        }

        public string deleteUser()
        {
            User user = OperationContext.Current.RequestContext.RequestMessage.GetBody<User>(new DataContractJsonSerializer(typeof(User)));
            return UserDao.deleteUser(user);
        }

        public string updateEmployee()
        {
            Employee employee = OperationContext.Current.RequestContext.RequestMessage.GetBody<Employee>(new DataContractJsonSerializer(typeof(Employee)));
            return UserDao.updateEmployee(employee);
        }
    }
}
