using Chatbot.Models;
using Chatbot.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Runtime.Serialization.Json;
using System.Web;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Chatbot.Services
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "StatisticsService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez StatisticsService.svc ou StatisticsService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class StatisticsService : IStatisticsService
    {
        List<History> IStatisticsService.getAllMissedMessages()
        {
            return StatisticsDao.getAllMissedMessages();
        }

        Chart IStatisticsService.getMostExecutedConversations()
        {
            return StatisticsDao.getMostExecutedConversations();
        }

        Chart IStatisticsService.getMostExecutedTasks()
        {
            return StatisticsDao.getMostExecutedTasks();
        }

        int IStatisticsService.getNumberOfConversations()
        {
            return StatisticsDao.getNumberOfConversations();
        }

        int IStatisticsService.getNumberOfFunctions()
        {
            return StatisticsDao.getNumberOfFunctions();
        }

        Chart IStatisticsService.getNumberOfMessagesPerDate()
        {
            return StatisticsDao.getNumberOfMessagesPerDate();
        }

        Chart IStatisticsService.getNumberOfMessagesPerFunction()
        {
            return StatisticsDao.getNumberOfMessagesPerFunction();
        }

        Chart IStatisticsService.getNumberOfMessagesPerFunctionAndDate()
        {
            return StatisticsDao.getNumberOfMessagesPerFunctionAndDate();
        }

        int IStatisticsService.getNumberOfMissedMessages()
        {
            return StatisticsDao.getNumberOfMissedMessages();
        }

        int IStatisticsService.getNumberOfTasks()
        {
            return StatisticsDao.getNumberOfTasks();
        }

        int IStatisticsService.getNumberOfUsers()
        {
            return StatisticsDao.getNumberOfUsers();
        }

        int IStatisticsService.getTotalNumberOfMessages()
        {
            return StatisticsDao.getTotalNumberOfMessages();
        }
    }
}
