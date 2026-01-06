using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HRM.Models;

namespace HRM.Controllers
{
    public class HomeController : BaseController
    {
        HRMEntities db = new HRMEntities();

        public ActionResult Index()
        {


            



            // Retrieve slide show images for home page
            var images = db.SlideShows.OrderBy(s => s.priority).ToList();
            ViewBag.SlideShow = images;

            // Get latest 6 emergency appeal to display in home page
            var appeals = db.Appeals.OrderByDescending(a => a.appeal_id).Take(6).ToList();
            return View(appeals);
        }


        public ActionResult Services()
        {
            return View();
        }


        public ActionResult Ramadan()
        {
            return View();
        }

        public ActionResult GetInvolved()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Volunteering(string firstname,string surname, string gender, string birthday, string address, string email, string emergencyContactName,string contactNumber)
        {
            try
            {
                CandidateVolunteer volunteer = new CandidateVolunteer();
                volunteer.firstname = firstname;
                volunteer.surname = surname;
                volunteer.gender = gender;
                volunteer.birthday = birthday;
                volunteer.address = address;
                volunteer.email = email;
                volunteer.emergencyContactName = emergencyContactName;
                volunteer.contactNumber = contactNumber;

                db.CandidateVolunteers.Add(volunteer);
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


        [HttpPost]
        public JsonResult Subscribe(string Email, bool Subscribe)
        {
            try
            {
                var mail = db.Subscribers.Where(m => m.email == Email).FirstOrDefault();
                if (mail == null)
                {
                    Subscriber newMail = new Subscriber();
                    newMail.email = Email;
                    newMail.subscribe = Subscribe;
                    db.Subscribers.Add(newMail);
                    int rows = db.SaveChanges();
                    if (rows > 0)
                    {
                        return Json("subscribed", JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json("did not subscribe", JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json("already subscribed", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult Subscribers()
        {
            try
            {
                var mails = db.Subscribers.OrderByDescending(s => s.id).ToList();
                return View(mails);
            }
            catch (Exception)
            {

                throw;
            }
            
        }


        public ActionResult CandidateVolunteers()
        {
            try
            {
                var volunteers = db.CandidateVolunteers.OrderByDescending(c => c.id).ToList();
                return View(volunteers);
            }
            catch (Exception)
            {

                throw;
            }
        }



    }
}