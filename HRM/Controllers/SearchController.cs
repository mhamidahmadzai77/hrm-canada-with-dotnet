using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HRM.Models;
using System.Data.Entity.SqlServer; // Required for SqlFunctions 

namespace HRM.Controllers
{
    public class SearchController : BaseController
    {
        HRMEntities db = new HRMEntities();

        // GET: Search
        public ActionResult Index(string s)
        {
            // Normalize the search term to ensure case insensitive comparison  
            var normalizedSearchTerm = s?.Trim().ToLower(); // Use safe navigation to avoid null reference  

            var appeals = db.Appeals.Where(a => a.title.Contains(normalizedSearchTerm) || a.meta_data.Contains(normalizedSearchTerm) || a.country.Contains(normalizedSearchTerm) || a.content.Contains(normalizedSearchTerm)).OrderByDescending(o => o.appeal_id).ToList();
            ViewBag.searchedAppeals = appeals;
            ViewBag.numberOfResult = appeals.Count;

            // Fetching searched projects  
            var searchedProjects = db.Projects.Where(p => p.project_name.Contains(normalizedSearchTerm)).ToList();

            ViewBag.searchedProjects = searchedProjects;
            ViewBag.numberOfResult += searchedProjects.Count;
            return View();
        }
    }
}