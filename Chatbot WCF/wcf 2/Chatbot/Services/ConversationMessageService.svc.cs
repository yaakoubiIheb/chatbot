using Chatbot.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.ServiceModel;
using System.Text;

namespace Chatbot.Services
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "ConversationMessageService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez ConversationMessageService.svc ou ConversationMessageService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class ConversationMessageService : IConversationMessageService
    {
        private Connection.Connection connection = new Connection.Connection();
        public string insertConversationMessage()
        {
            ConversationMessage conversationMessage = OperationContext.Current.RequestContext.RequestMessage.GetBody
                <ConversationMessage>(new DataContractJsonSerializer(typeof(ConversationMessage)));
            string Message;



            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("insert into [Chatbot].[dbo].[ConversationResponse] values(@response,@ruleId)", conn);
                cmd.Parameters.AddWithValue("@response", conversationMessage.response);
                cmd.Parameters.AddWithValue("@ruleId", conversationMessage.ruleId);
                int result = cmd.ExecuteNonQuery();
                if (result == 1)
                {
                    Message = "conversation message ajouté avec succés";
                }
                else
                {
                    Message = "conversation pas ajouté";
                }



                conn.Close();
            }




            return Message;
        }








        public string deleteConversationMessage()
        {

            string message;
            ConversationMessage conversationMessage = OperationContext.Current.RequestContext.RequestMessage.GetBody
                <ConversationMessage>(new DataContractJsonSerializer(typeof(ConversationMessage)));


            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("DELETE FROM [Chatbot].[dbo].[ConversationResponse] where [Chatbot].[dbo].[ConversationResponse]" +
                    ".[id]= @id", conn);
                cmd.Parameters.AddWithValue("@id", conversationMessage.id);

                int result = cmd.ExecuteNonQuery();



                if (result == 1)
                {
                    message = "suppression avec succés";
                }
                else
                {
                    message = "echec suppression";
                }

                conn.Close();

            }
            return message;

        }
    }
}
