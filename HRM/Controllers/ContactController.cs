using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HRM.Models;

namespace HRM.Controllers
{
    public class ContactController : BaseController
    {
        // GET: Contact
        HRMEntities db = new HRMEntities();
        public ActionResult Index()
        {


            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpPost]
        public JsonResult Index(string firstname, string lastname, string email, string country, string subject, string message)
        {
            try
            {
                string sanitizedMessage = message
           .Replace("\r\n", " ") // Replace Windows newlines with a space  
           .Replace("\n", " ")    // Replace Unix newlines with a space  
           .Replace("\r", " ")    // Replace carriage returns with a space  
           .Trim();              // Trim leading and trailing white spaces  


                Contact contact = new Contact();
                contact.firstname = firstname;
                contact.lastname = lastname;
                contact.email = email;
                contact.country = country;
                contact.subject = subject;
                contact.message = sanitizedMessage.ToString();
                contact.read = "no";
                contact.time = DateTime.Now;

                db.Contacts.Add(contact);
                int rows = db.SaveChanges();
                if (rows > 0)
                {
                    return Json("saved", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json("did not save", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetContact(long id)
        {
            Contact contact = db.Contacts.Where(c => c.contact_id == id).FirstOrDefault();
            contact.read = "yes";
            db.SaveChanges();
            Session["contact_id"] = id;
            return RedirectToAction("ContactList");
        }

        public JsonResult ReadContact(long id)
        {
            Contact contact = db.Contacts.Where(c => c.contact_id == id).FirstOrDefault();
            contact.read = "yes";
            db.SaveChanges();
            return Json("", JsonRequestBehavior.AllowGet);
        }
        public ActionResult ContactList()
        {

            if (Session["contact_id"] != null)
            {
                long id = Convert.ToInt64(Session["contact_id"]);
                ViewBag.selectedContact = db.Contacts.Where(c => c.contact_id == id).ToList();
                Session["contact_id"] = null;
            }
            var records = db.Contacts
                .OrderByDescending(r => r.time)
                .ToList();

            var currentDateTime = DateTime.Now;

            var customizedRecords = records.Select(record => new ContactViewModel
            {
                contact_id = record.contact_id,
                firstname = record.firstname,
                lastname = record.lastname,
                email = record.email,
                country = record.country,
                subject = record.subject,
                message = record.message,
                time = record.time,
                read = record.read,
                // calculate how much time ago end user contacted  
                difference_time = GetTimeDifference(record.time, currentDateTime)
            }).ToList();

            ViewBag.contacts = customizedRecords;
            return View();
        }


        // Helper method to calculate the time difference as a string  
        private string GetTimeDifferenceShortNames(DateTime recordTime, DateTime currentDateTime)
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
        // Helper method to calculate the time difference as a string  
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
                datetime_difference = $"{(int)difference.TotalSeconds} seconds ago";
            }
            else if (difference.TotalMinutes < 60)
            {
                datetime_difference = $"{(int)difference.TotalMinutes} minutes ago";
            }
            else if (difference.TotalHours < 24)
            {
                datetime_difference = $"{(int)difference.TotalHours} hours ago";
            }
            else if (difference.TotalDays < 30)
            {
                int days = (int)difference.TotalDays;
                datetime_difference = $"{days} day{(days > 1 ? "s" : "")} ago";
            }
            else if (difference.TotalDays < 365)
            {
                int months = (int)(difference.TotalDays / 30);
                datetime_difference = $"{months} month{(months > 1 ? "s" : "")} ago";
            }
            else
            {
                int years = (int)(difference.TotalDays / 365);
                datetime_difference = $"{years} year{(years > 1 ? "s" : "")} ago";
            }

            return datetime_difference;
        }


    }
}