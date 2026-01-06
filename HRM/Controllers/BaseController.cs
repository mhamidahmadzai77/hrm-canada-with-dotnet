using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HRM.Models;
using Newtonsoft.Json;

namespace HRM.Controllers
{
    public class BaseController : Controller
    {
        
        HRMEntities db = new HRMEntities();

        // private variable of basket cookie key
        private const string BasketCookieKey = "BasketCookie";

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            // Populate ViewBag with common values  
            var records = db.Contacts
               .OrderByDescending(r => r.time)
               .Take(150)
               .ToList();

            var currentDateTime = DateTime.Now;

            var customizedRecords = records.Select(record => new ContactViewModel
            {
                contact_id = record.contact_id,
                firstname = record.firstname,
                lastname = record.lastname,
                read = record.read,
                // Customizing the time attribute  
                difference_time = GetTimeDifference(record.time, currentDateTime)
            }).ToList();

            ViewBag.contacts = customizedRecords;

            // Get current appeals
            var currentAppeals = db.Appeals.Where(a => a.status == "published").OrderByDescending(o => o.appeal_id).ToList();
            ViewBag.appeals = currentAppeals;


            #region 
            // Get basket data
            var cookie = Request.Cookies[BasketCookieKey];
            var basket = new List<DonationItem>();
            if (cookie != null)
            {
                basket = JsonConvert.DeserializeObject<List<DonationItem>>(cookie.Value);
            }
            ViewBag.basket =  basket;
            #endregion
        }

        private string GetTimeDifference(DateTime recordTime, DateTime currentDateTime)
        {
            TimeSpan difference = currentDateTime - recordTime;
            string datetime_difference;

            if (difference.TotalSeconds < 1)
            {
                datetime_difference = "Just now";
            }
            else if (difference.TotalSeconds < 60)
            {
                datetime_difference = $"{(int)difference.TotalSeconds} seconds";
            }
            else if (difference.TotalMinutes < 60)
            {
                datetime_difference = $"{(int)difference.TotalMinutes} mins";
            }
            else if (difference.TotalHours < 24)
            {
                datetime_difference = $"{(int)difference.TotalHours} hrs";
            }
            else if (difference.TotalDays < 30)
            {
                int days = (int)difference.TotalDays;
                datetime_difference = $"{days} day{(days > 1 ? "s" : "")}";
            }
            else if (difference.TotalDays < 365)
            {
                int months = (int)(difference.TotalDays / 30);
                datetime_difference = $"{months} month{(months > 1 ? "s" : "")}";
            }
            else
            {
                int years = (int)(difference.TotalDays / 365);
                datetime_difference = $"{years} year{(years > 1 ? "s" : "")}";
            }

            return datetime_difference;
        }
    }
}