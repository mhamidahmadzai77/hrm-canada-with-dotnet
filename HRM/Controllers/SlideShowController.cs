using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HRM.Models;

namespace HRM.Controllers
{
    public class SlideShowController : BaseController
    {
        HRMEntities db = new HRMEntities();
        // GET: SlideShow
        public ActionResult Index()
        {

            var slideShowData = db.SlideShows.OrderBy(s => s.priority).ToList();
            return View(slideShowData);
        }

        public ActionResult Registration()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Registraion(int priority, string appealURL)
        {
            try
            {
                var image = Request.Files["image"];

                // Check if image is uploaded
                if (image != null && image.ContentLength > 0)
                {
                    // Generate unique file name
                    string fileName = Path.GetFileNameWithoutExtension(image.FileName);
                    string extension = Path.GetExtension(image.FileName);
                    string uniqueFileName = fileName + "_" + Guid.NewGuid().ToString() + extension;


                    string folderPath = Server.MapPath("~/Content/pic/slideshow-images/");
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }

                    // Combine folder and unique file name
                    string filePath = Path.Combine(folderPath, uniqueFileName);

                    // Save the file to the folder
                    image.SaveAs(filePath);

                    // Save only relative path in DB
                    string relativePath = "/Content/pic/slideshow-images/" + uniqueFileName;

                    SlideShow slideShow = new SlideShow();
                    slideShow.priority = priority;
                    slideShow.url = appealURL;
                    slideShow.imagePath = relativePath;  // Assume you have imagePath column in DB

                    db.SlideShows.Add(slideShow);
                    int rows = db.SaveChanges();
                    if (rows > 0)
                    {
                        var redirect = Url.Action("Index", "Home");
                        return Json(new
                        {
                            redirectTo = redirect
                        });
                    }
                    else
                    {
                        return Json("did not save", JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json("No image uploaded", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult GetSlideShowImagePath(long id)
        {
            var slideShow = db.SlideShows.Find(id);
            if (slideShow != null && !string.IsNullOrEmpty(slideShow.imagePath))
            {
                string fullPath = Server.MapPath(slideShow.imagePath);

                if (System.IO.File.Exists(fullPath))
                {
                    string mimeType = MimeMapping.GetMimeMapping(fullPath);
                    return File(fullPath, mimeType);
                }
                else
                {
                    return HttpNotFound("Image file not found.");
                }
            }
            else
            {
                return HttpNotFound("Slide show record not found.");
            }
        }


        public ActionResult UpdateSlideshowImage(int id)
        {
            var slideshow = db.SlideShows.Find(id);
            return View(slideshow);
        }

        [HttpPost]
        public JsonResult UpdateSlideshowImage(int id, int priority, string appealURL)
        {
            try
            {
                SlideShow slideshow = db.SlideShows.Find(id);
                if (slideshow == null)
                {
                    return Json("Slide show record not found", JsonRequestBehavior.AllowGet);
                }

                slideshow.priority = priority;
                slideshow.url = appealURL;

                var image = Request.Files["image"];
                if (image != null && image.ContentLength > 0)
                {
                    // Generate unique file name
                    string fileName = Path.GetFileNameWithoutExtension(image.FileName);
                    string extension = Path.GetExtension(image.FileName);
                    string uniqueFileName = fileName + "_" + Guid.NewGuid().ToString() + extension;

                    // Define the folder path
                    string folderPath = Server.MapPath("~/Content/pic/slideshow-images/");
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }

                    // Combine folder and unique file name
                    string filePath = Path.Combine(folderPath, uniqueFileName);

                    // Save the file to the folder
                    image.SaveAs(filePath);

                    // Save only relative path in DB
                    string relativePath = "/Content/pic/slideshow-images/" + uniqueFileName;

                    // Optional: Delete old image file if exists
                    if (!string.IsNullOrEmpty(slideshow.imagePath))
                    {
                        string oldImagePath = Server.MapPath(slideshow.imagePath);
                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    // Update image path in DB
                    slideshow.imagePath = relativePath;
                }

                int rows = db.SaveChanges();
                if (rows > 0)
                {
                    var redirect = Url.Action("Index", "SlideShow");
                    return Json(new
                    {
                        redirectTo = redirect
                    });
                }
                else
                {
                    return Json("did not update", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }



        [HttpPost]
        public JsonResult DeleteSlideShowRecord(long id)
        {
            try
            {
                SlideShow slideShow = db.SlideShows.Find(id);
                if (slideShow != null)
                {
                    // Delete image file from server
                    if (!string.IsNullOrEmpty(slideShow.imagePath))
                    {
                        string fullPath = Server.MapPath(slideShow.imagePath);
                        if (System.IO.File.Exists(fullPath))
                        {
                            System.IO.File.Delete(fullPath);
                        }
                    }

                    // Remove record from database
                    db.SlideShows.Remove(slideShow);
                    int rows = db.SaveChanges();
                    if (rows > 0)
                    {
                        return Json("deleted", JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json("did not delete", JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json("record not found", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }



    }
}