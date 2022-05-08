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
using System.Xml;
namespace Chatbot.Services
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "ConversationService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez ConversationService.svc ou ConversationService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class ConversationService : IConversationService
    {
        List<Conversation> IConversationService.getAllConversations()
        {
            return ConversationDao.getAllConversations();
        }

        Conversation IConversationService.getConversationByTitle(string title)
        {
            return ConversationDao.getConversationByTitle(title);
        }

        string IConversationService.insertConversation()
        {
            Conversation conversation = OperationContext.Current.RequestContext.RequestMessage.GetBody<Conversation>(new DataContractJsonSerializer(typeof(Conversation)));
            return ConversationDao.insertConversation(conversation);
        }

        string IConversationService.updateConversation()
        {
            Conversation conversation = OperationContext.Current.RequestContext.RequestMessage.GetBody<Conversation>(new DataContractJsonSerializer(typeof(Conversation)));
            return ConversationDao.updateConversation(conversation);
        }

        string IConversationService.deleteConversation(int id)
        {
            return ConversationDao.deleteConversation(id);
        }
    }
}
