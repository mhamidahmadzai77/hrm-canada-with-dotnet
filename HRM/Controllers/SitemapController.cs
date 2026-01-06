using System;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using HRM.Models; 

public class SitemapController : Controller
{
    private HRMEntities db = new HRMEntities();

    public ActionResult Index()
    {
        var sb = new StringBuilder();
        sb.Append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        sb.Append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        // Static pages for Home Controller  
        AppendUrl(sb, "Index", "Home", 1.0);
        AppendUrl(sb, "Contact", "Home", 0.8);
        AppendUrl(sb, "About", "Home", 0.8);
        AppendUrl(sb, "Services", "Home", 0.8);
        AppendUrl(sb, "GetInvolved", "Home", 0.8);
        AppendUrl(sb, "Subscribers", "Home", 0.6);
        AppendUrl(sb, "CandidateVolunteers", "Home", 0.6);

        // About_Us Controller actions  
        AppendUrl(sb, "Index", "About_Us", 0.8);
        AppendUrl(sb, "Who_we_are", "About_Us", 0.7);
        AppendUrl(sb, "AnnualReports", "About_Us", 0.7);
        AppendUrl(sb, "Manage_Annual_Reports", "About_Us", 0.6);
        AppendUrl(sb, "Our_Policies", "About_Us", 0.7);
        AppendUrl(sb, "Manage_Policies", "About_Us", 0.6);
        AppendUrl(sb, "FrequentlyAskedQuestion", "About_Us", 0.5);


        // Appeal Controller actions  
        AppendUrl(sb, "Index", "Appeal", 0.8);
        
        // Base Controller actions  
        AppendUrl(sb, "Index", "Base", 0.8);

        // Basket Controller actions  
        AppendUrl(sb, "Index", "Basket", 0.8);
        AppendUrl(sb, "AddToBasket", "Basket", 0.7);
        
        // Contact Controller actions  
        AppendUrl(sb, "Index", "Contact", 0.8);
        
        // Donation Controller actions  
        AppendUrl(sb, "Index", "Donation", 0.8);
        AppendUrl(sb, "Donate_Start", "Donation", 0.7);
        AppendUrl(sb, "Donors", "Donation", 0.6);

        // ** Service Controller actions added below **  
        AppendUrl(sb, "Index", "Service", 0.8);
        AppendUrl(sb, "FoodSecurity", "Service", 0.7);
        AppendUrl(sb, "SponsorshipProgramme", "Service", 0.7);
        AppendUrl(sb, "Health", "Service", 0.7);
        AppendUrl(sb, "TechnicalSchool", "Service", 0.7);
        AppendUrl(sb, "WaterAid", "Service", 0.7);
        AppendUrl(sb, "BuildingMasjid", "Service", 0.7);
        AppendUrl(sb, "Orphanage", "Service", 0.7);
        AppendUrl(sb, "GreenAfghanistan", "Service", 0.7);
        AppendUrl(sb, "Bakery", "Service", 0.7);
        AppendUrl(sb, "Ambulance", "Service", 0.7);


        // User Controller actions  
        AppendUrl(sb, "Index", "User", 0.8);
        AppendUrl(sb, "AdminLoginView", "User", 0.7);
        AppendUrl(sb, "LoginView", "User", 0.7);
        AppendUrl(sb, "DisplayImage", "User", 0.6);
        AppendUrl(sb, "SigninView", "User", 0.7);
        AppendUrl(sb, "ResetPasswordView", "User", 0.6);
        AppendUrl(sb, "ConfirmPasswordView", "User", 0.6);
        AppendUrl(sb, "MyProfile", "User", 0.8);
        AppendUrl(sb, "UserView", "User", 0.7);
        AppendUrl(sb, "EditUser", "User", 0.6);

        // Dynamic Annual Reports URLs  
        var annualReports = db.Annual_Report.ToList();
        foreach (var report in annualReports)
        {
            AppendUrl(sb, "Update_Annual_Report", "About_Us", 0.6, new { id = report.annual_report_id });
        }

        // Dynamic Policies URLs  
        var policies = db.Policies.ToList();
        foreach (var policy in policies)
        {
            AppendUrl(sb, "Update_Policy", "About_Us", 0.6, new { id = policy.policy_id });
            AppendUrl(sb, "DownloadPolicy", "About_Us", 0.5, new { policy = policy.policy_name });
        }

        sb.Append("</urlset>");
        return Content(sb.ToString(), "text/xml");
    }

    private void AppendUrl(StringBuilder sb, string action, string controller, double priority, object routeValues = null)
    {
        string url = Url.Action(action, controller, routeValues, Request.Url.Scheme);
        sb.Append("<url>");
        sb.AppendFormat("<loc>{0}</loc>", url);
        sb.AppendFormat("<changefreq>{0}</changefreq>", "monthly");
        sb.AppendFormat("<priority>{0}</priority>", priority);
        sb.Append("</url>");
    }
}