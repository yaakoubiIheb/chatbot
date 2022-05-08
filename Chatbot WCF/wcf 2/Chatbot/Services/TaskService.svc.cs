using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Runtime.Serialization.Json;
using Chatbot.Models;
using Chatbot.Dao;
using System.Xml;

namespace Chatbot.Services
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "TaskService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez TaskService.svc ou TaskService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class TaskService : ITaskService
    {
        List<Task> ITaskService.getAllTasks()
        {
            return TaskDao.getAllTasks();
        }

        Task ITaskService.getTaskByTitle(string title)
        {
            return TaskDao.getTaskByTitle(title);
        }

        string ITaskService.insertTask()
        {
            Task task = getBody();
            TaskDao.insertTask(task);
            return "Tache ajoutée";
        }

        string ITaskService.updateTask()
        {
            Task task = getBody();
            TaskDao.updateTask(task);
            return "Tache modifiée";
        }

        string ITaskService.deleteTask(int id)
        {
            TaskDao.deleteTask(id);
            return "Tache Supprimée";
        }

        Task getBody()
        {
            Task task = OperationContext.Current.RequestContext.RequestMessage.GetBody<Task>(new DataContractJsonSerializer(typeof(Task)));
            string taskXml = OperationContext.Current.RequestContext.RequestMessage.ToString();
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(taskXml);
            XmlNodeList xmlNodeList = doc.SelectNodes("/root/sequenceMessages/item");
            task.sequenceMessages = new List<SequenceMessage>();
            foreach (XmlNode node in xmlNodeList)
            {
                if (node["sequenceType"].InnerText == "options")
                {
                    Option option = new Option();
                    option.id = int.Parse(node["id"].InnerText);
                    option.question = node["question"].InnerText;
                    option.attribute = node["attribute"].InnerText;
                    option.sequenceType = node["sequenceType"].InnerText;
                    option.ruleId = int.Parse(node["ruleId"].InnerText);
                    XmlNodeList xmlOptionMessagesList = node["optionMessages"].ChildNodes;
                    foreach (XmlNode optionMessageNode in xmlOptionMessagesList)
                    {
                        OptionMessage optionMessage = new OptionMessage();
                        optionMessage.id = int.Parse(optionMessageNode["id"].InnerText);
                        optionMessage.message = optionMessageNode["message"].InnerText;
                        optionMessage.value = optionMessageNode["value"].InnerText;
                        optionMessage.optionId = int.Parse(optionMessageNode["optionId"].InnerText);
                        option.optionMessages.Add(optionMessage);
                    }
                    task.sequenceMessages.Add(option);
                }
                else
                {
                    Input input = new Input();
                    input.id = int.Parse(node["id"].InnerText);
                    input.question = node["question"].InnerText;
                    input.attribute = node["attribute"].InnerText;
                    input.sequenceType = node["sequenceType"].InnerText;
                    input.valueType = node["valueType"].InnerText;
                    input.controlType = node["controlType"].InnerText;
                    input.ruleId = int.Parse(node["ruleId"].InnerText);
                    task.sequenceMessages.Add(input);
                }
            }
            return task;
        }
    }
}
