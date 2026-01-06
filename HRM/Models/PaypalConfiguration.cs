using PayPal.Api;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace HRM.Models
{
    public static class PaypalConfiguration
    {
        //Variables for storing the clientID and clientSecret key  
        public readonly static string ClientId;
        public readonly static string ClientSecret;
        //Constructor  
        static PaypalConfiguration()
        {
           
            ClientId = ConfigurationManager.AppSettings["clientId"]; 
            ClientSecret = ConfigurationManager.AppSettings["clientSecret"]; 
        }
        // getting properties from the web.config  
        public static Dictionary<string, string> GetConfig()
        {
            return new Dictionary<string, string>()
            {
                {"mode","live"} //Change sendbox to live for production
            };
        }
        private static string GetAccessToken()
        {
            // getting accesstocken from paypal  
            string accessToken = new OAuthTokenCredential(ClientId, ClientSecret, new Dictionary<string, string>()
            {
                {"mode","live"}  //Change sendbox to live for production
            }).GetAccessToken();
            return accessToken;
        }
        public static APIContext GetAPIContext()
        {
            // return apicontext object by invoking it with the accesstoken  
            APIContext apiContext = new APIContext(GetAccessToken());
            apiContext.Config = GetConfig();
            return apiContext;
        }
    }
}