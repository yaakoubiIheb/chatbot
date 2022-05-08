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
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "SequenceMessageService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez SequenceMessageService.svc ou SequenceMessageService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class SequenceMessageService : ISequenceMessageService
    {
        private Connection.Connection connection = new Connection.Connection();


        public string insertSequenceMessage()
        {
            SequenceMessage sequenceMessage = OperationContext.Current.RequestContext.RequestMessage.GetBody
                <SequenceMessage>(new DataContractJsonSerializer(typeof(SequenceMessage)));
            string Message;



            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("insert into [Chatbot].[dbo].[SequenceMessage] values(@message,@attribute,@ruleId)", conn);
                cmd.Parameters.AddWithValue("@message", sequenceMessage.message);
                cmd.Parameters.AddWithValue("@ruleId", sequenceMessage.ruleId);
                cmd.Parameters.AddWithValue("@attribute", sequenceMessage.attribut);
                int result = cmd.ExecuteNonQuery();
                if (result == 1)
                {
                    Message = "Sequence ajouté avec succés";
                }
                else
                {
                    Message = "Sequence pas ajouté";
                }



                conn.Close();
            }




            return Message;
        }








        public string deleteSequenceMessage()
        {

            string message;
            SequenceMessage sequenceMessage = OperationContext.Current.RequestContext.RequestMessage.GetBody
                <SequenceMessage>(new DataContractJsonSerializer(typeof(SequenceMessage)));


            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("DELETE FROM [Chatbot].[dbo].[SequenceMessage] where [Chatbot].[dbo].[SequenceMessage]" +
                    ".[id]= @id", conn);
                cmd.Parameters.AddWithValue("@id", sequenceMessage.id);

                int result = cmd.ExecuteNonQuery();



                if (result == 1)
                {
                    message = "Sequence supprimé avec succés";
                }
                else
                {
                    message = "Sequence pas supprimé";
                }

                conn.Close();

            }
            return message;

        }
    }
}
