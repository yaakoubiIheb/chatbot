using Chatbot.Models;
using Chatbot.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Runtime.Serialization.Json;

namespace Chatbot.Services
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "Function_RuleService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez Function_RuleService.svc ou Function_RuleService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class Function_RuleService : IFunction_RuleService
    {
        public List<Function> getAllRuleFunctions(int ruleId)
        {
            return Function_RuleDao.getAllRuleFunctions(ruleId);
        }

        public List<Conversation> getAllFunctionConversations(int functionId)
        {
            return Function_RuleDao.getAllFunctionConversations(functionId);
        }

        public List<Task> getAllFunctionTasks(int functionId)
        {
            return Function_RuleDao.getAllFunctionTasks(functionId);
        }

        public string insertRuleFunctions()
        {
            RuleFunctions ruleFunctions = OperationContext.Current.RequestContext.RequestMessage.GetBody<RuleFunctions>(new DataContractJsonSerializer(typeof(RuleFunctions)));
            return Function_RuleDao.insertRuleFunctions(ruleFunctions.ruleId, ruleFunctions.functionIds); ;
        }

        public string updateRuleFunctions()
        {
            RuleFunctions ruleFunctions = OperationContext.Current.RequestContext.RequestMessage.GetBody<RuleFunctions>(new DataContractJsonSerializer(typeof(RuleFunctions)));
            return Function_RuleDao.updateRuleFunctions(ruleFunctions.ruleId, ruleFunctions.functionIds); ;
        }

        public string deleteFunctionRules(int functionId)
        {
            Function_RuleDao.deleteFunctionRules(functionId);
            return "Régles supprimées";
        }

        public string deleteRuleFunctions(int ruleId)
        {
            return Function_RuleDao.deleteRuleFunctions(ruleId);
        }
    }
}
