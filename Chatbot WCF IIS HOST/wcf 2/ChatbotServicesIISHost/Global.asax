<%@ Application Language="C#" %>

<script RunAt="server">

    void Application_Start(object sender, EventArgs e)
    {
        // Code qui s’exécute au démarrage de l’application

    }

    void Application_End(object sender, EventArgs e)
    {
        //  Code qui s’exécute à l’arrêt de l’application

    }

    void Application_Error(object sender, EventArgs e)
    {
        // Code qui s'exécute lorsqu'une erreur non gérée se produit

    }

    void Session_Start(object sender, EventArgs e)
    {
        // Code qui s’exécute lorsqu’une nouvelle session démarre

    }
    protected void Application_BeginRequest(object sender, EventArgs e)
    {
        var context = HttpContext.Current;
        var response = context.Response;

        // enable CORS
        //response.AddHeader("Access-Control-Allow-Origin", "*");
        response.AddHeader("X-Frame-Options", "ALLOW-FROM *");
        response.AddHeader("Access-Control-Allow-Headers", "*");

        if (context.Request.HttpMethod == "OPTIONS")
        {
            response.AddHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
            response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
            response.AddHeader("Access-Control-Max-Age", "1728000");
            response.End();
        }
    }

    void Session_End(object sender, EventArgs e)
    {
        // Code qui s’exécute lorsqu’une session se termine. 
        // Remarque : l'événement Session_End est déclenché uniquement lorsque le mode sessionstate
        // a la valeur InProc dans le fichier Web.config. Si le mode de session a la valeur StateServer 
        // ou SQLServer, l’événement n’est pas déclenché.

    }

</script>
