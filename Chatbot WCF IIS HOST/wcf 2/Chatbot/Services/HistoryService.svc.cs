using Chatbot.Models;
using Chatbot.Dao;
using System.Collections.Generic;
using System.Runtime.Serialization.Json;
using System.ServiceModel;

namespace Chatbot.Services
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "HistoryService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez HistoryService.svc ou HistoryService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class HistoryService : IHistoryService
    {
        private Connection.Connection connection = new Connection.Connection();

        public List<History> getUserHistory(int userId, string date)
        {
            return HistoryDao.getUserHistory(userId, date);
        }
        public List<History> getAllUsersHistory(string date)
        {
            return HistoryDao.getAllUsersHistory(date);
        }
        public List<History> getLast50Message(string username)
        {
            return HistoryDao.getLast50Message(username);
        }

        public string insertHistory()
        {
            History history = OperationContext.Current.RequestContext.RequestMessage.GetBody
              <History>(new DataContractJsonSerializer(typeof(History)));

            return HistoryDao.insertHistory(history);
        }




        public string deleteAllUserHistory(int userId)
        {
            return HistoryDao.deleteAllUserHistory(userId);
        }



        public string deleteHistoryById(int historyId)
        {
            return HistoryDao.deleteHistoryById(historyId);
        }

    }
}
