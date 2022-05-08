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
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "TriggerService" à la fois dans le code, le fichier svc et le fichier de configuration.
    // REMARQUE : pour lancer le client test WCF afin de tester ce service, sélectionnez TriggerService.svc ou TriggerService.svc.cs dans l'Explorateur de solutions et démarrez le débogage.
    public class TriggerService : ITriggerService
    {

        private Connection.Connection connection = new Connection.Connection();


        public string insertTrigger()
        {
            Trigger trigger = OperationContext.Current.RequestContext.RequestMessage.GetBody
                <Trigger>(new DataContractJsonSerializer(typeof(Trigger)));
            string Message;

            
            
                using (SqlConnection conn = new SqlConnection(connection.connectionString))
                {
                    conn.Open();

                    SqlCommand cmd = new SqlCommand("insert into [Chatbot].[dbo].[trigger] values(@message,@ruleId)", conn);
                    cmd.Parameters.AddWithValue("@message", trigger.message);
                    cmd.Parameters.AddWithValue("@ruleId", trigger.ruleId);
                    int result = cmd.ExecuteNonQuery();
                    if (result == 1)
                    {
                        Message =  "Le trigger a eté ajouté avec succés";
                    }
                    else
                    {
                        Message =  "Le trigger pas ajouté";
                    }


                    
                    conn.Close();
                }



            
            return Message;
        }








        public string deleteTrigger()
        {

            string message;
            Trigger trigger = OperationContext.Current.RequestContext.RequestMessage.GetBody<Trigger>(new DataContractJsonSerializer(typeof(Trigger)));


            using (SqlConnection conn = new SqlConnection(connection.connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("DELETE FROM [Chatbot].[dbo].[Trigger] where [Chatbot].[dbo].[trigger]" +
                    ".[id]= @id", conn);
                cmd.Parameters.AddWithValue("@id", trigger.id);

                int result = cmd.ExecuteNonQuery();

                

                if (result == 1)
                {
                    message = "Trigger a eté supprimé avec succés";
                }
                else
                {
                    message =  "Trigger pas supprimé";
                }

                conn.Close();

            }
            return message;

        }
    }
}
