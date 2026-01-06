using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HRM.Models;


namespace HRM.Controllers
{
    public class AppealsController : BaseController
    {

        // GET: Appeals

        HRMEntities db = new HRMEntities();

        public ActionResult Index()
        {
            var appeals = db.Appeals.OrderByDescending(a => a.appeal_id).Take(6).ToList();
            return View(appeals);
        }

        public ActionResult Appeal(long id, string emergency_appeal)
        {
            var appeal = db.Appeals.Where(a => a.appeal_id == id).FirstOrDefault();
            return View(appeal);
        }


        public ActionResult Add()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Add(string title, string metadata, string country, string content, int lowDonateAmount, int mediumDonateAmount, int highDonateAmount, string lowDonateAmountMessage, string mediumDonateAmountMessage, string highDonateAmountMessage, string contentImage1Note, string contentImage2Note)
        {
            try
            {
                var appealTitle = db.Appeals.Where(a => a.title == title).FirstOrDefault();
                if (appealTitle != null)
                {
                    return Json("available", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var image1 = Request.Files["image1"];
                    var image2 = Request.Files["image2"];
                    var image3 = Request.Files["image3"];

                    // Save images and get their relative paths
                    string image1Path = SaveImageAndGetPath(image1);
                    string image2Path = SaveImageAndGetPath(image2);
                    string image3Path = SaveImageAndGetPath(image3);

                    Appeal appeal = new Appeal();
                    appeal.title = title;
                    appeal.meta_data = metadata;
                    appeal.author = Session["user_108310113658"].ToString();
                    appeal.country = country;
                    appeal.content = content;
                    appeal.publication_date = Convert.ToDateTime(DateTime.Now.ToShortDateString());
                    appeal.status = "published";
                    appeal.amount1 = lowDonateAmount;
                    appeal.amount2 = mediumDonateAmount;
                    appeal.amount3 = highDonateAmount;
                    appeal.amount1Message = lowDonateAmountMessage;
                    appeal.amount2Message = mediumDonateAmountMessage;
                    appeal.amount3Message = highDonateAmountMessage;
                    appeal.contentImage1Note = contentImage1Note;
                    appeal.contentImage2Note = contentImage2Note;

                    // Save image paths (instead of byte[])
                    appeal.header_picture_path = image1Path;
                    appeal.content_picture1_path = image2Path;
                    appeal.content_picture2_path = image3Path;

                    db.Appeals.Add(appeal);
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
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        // Helper function to save image and return its relative path
        private string SaveImageAndGetPath(HttpPostedFileBase image)
        {
            if (image != null && image.ContentLength > 0)
            {
                string fileName = Path.GetFileNameWithoutExtension(image.FileName);
                string extension = Path.GetExtension(image.FileName);
                string uniqueFileName = fileName + "_" + Guid.NewGuid().ToString() + extension;

                // Folder path (same as slideshow)
                string folderPath = Server.MapPath("~/Content/pic/appeals/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                string filePath = Path.Combine(folderPath, uniqueFileName);
                image.SaveAs(filePath);

                string relativePath = "/Content/pic/appeals/" + uniqueFileName;
                return relativePath;
            }
            return null;
        }


        public ActionResult AppealsList()
        {
            // Ensure to fetch the data into a list first.  
            var appealsData = db.Appeals.OrderByDescending(o => o.appeal_id).ToList(); // This retrieves all records.  

            // Now project to List<Appeal>  
            List<Appeal> appeals = appealsData
                .Select(a => new Appeal
                {
                    appeal_id = a.appeal_id,
                    title = a.title,
                    meta_data = a.meta_data,
                    content = a.content,
                    author = a.author,
                    country = a.country,
                    publication_date = a.publication_date,
                    status = a.status
                })
                .ToList();

            return View(appeals);
        }

        public ActionResult AppealDetail(long id, string emergency_appeal)
        {
            var appeal2 = db.Appeals.Where(a => a.appeal_id == id).FirstOrDefault();
            return View(appeal2);
        }


        public ActionResult DisplayHeaderImage(long id)
        {
            var appeal = db.Appeals.Find(id);
            if (appeal != null && !string.IsNullOrEmpty(appeal.header_picture_path))
            {
                string fullPath = Server.MapPath(appeal.header_picture_path);

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
                return HttpNotFound("Appeal record not found.");
            }
        }


        public ActionResult DisplayContentImage1(long id)
        {
            var appeal = db.Appeals.Find(id);
            if (appeal != null && !string.IsNullOrEmpty(appeal.content_picture1_path))
            {
                string fullPath = Server.MapPath(appeal.content_picture1_path);

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
                return HttpNotFound("Appeal record not found.");
            }
        }

        public ActionResult DisplayContentImage2(long id)
        {
            var appeal = db.Appeals.Find(id);
            if (appeal != null && !string.IsNullOrEmpty(appeal.content_picture2_path))
            {
                string fullPath = Server.MapPath(appeal.content_picture2_path);

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
                return HttpNotFound("Appeal record not found.");
            }
        }


        public ActionResult UpdateAppeal(long id, string appeal)
        {
            var appeal2 = db.Appeals.Where(a => a.appeal_id == id).FirstOrDefault();
            return View(appeal2);
        }


        [HttpPost]
        public JsonResult UpdateAppeal(long id, string title, string metadata, string country, string status, string content, int lowDonateAmount, int mediumDonateAmount, int highDonateAmount, string lowDonateAmountMessage, string mediumDonateAmountMessage, string highDonateAmountMessage, string contentImage1Note, string contentImage2Note)
        {
            try
            {
                // Check for title uniqueness
                Appeal duplicateAppeal = db.Appeals.Where(a => a.title == title && a.appeal_id != id).FirstOrDefault();

                if (duplicateAppeal != null)
                {
                    return Json("available", JsonRequestBehavior.AllowGet);
                }

                Appeal appeal = db.Appeals.Find(id);

                if (appeal == null)
                {
                    return Json("not found", JsonRequestBehavior.AllowGet);
                }

                // Get uploaded files
                var image1 = Request.Files["image1"];
                var image2 = Request.Files["image2"];
                var image3 = Request.Files["image3"];

                // Update appeal fields
                appeal.title = title;
                appeal.meta_data = metadata;
                appeal.country = country;
                appeal.status = status;
                appeal.content = content;
                appeal.amount1 = lowDonateAmount;
                appeal.amount2 = mediumDonateAmount;
                appeal.amount3 = highDonateAmount;
                appeal.amount1Message = lowDonateAmountMessage;
                appeal.amount2Message = mediumDonateAmountMessage;
                appeal.amount3Message = highDonateAmountMessage;
                appeal.contentImage1Note = contentImage1Note;
                appeal.contentImage2Note = contentImage2Note;

                string folderPath = Server.MapPath("~/Content/pic/appeals/");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                // Header image (image1)
                if (image1 != null && image1.ContentLength > 0)
                {
                    // Delete old file
                    if (!string.IsNullOrEmpty(appeal.header_picture_path))
                    {
                        string oldFilePath = Server.MapPath(appeal.header_picture_path);
                        if (System.IO.File.Exists(oldFilePath))
                            System.IO.File.Delete(oldFilePath);
                    }

                    // Save new file
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(image1.FileName);
                    string path = Path.Combine(folderPath, fileName);
                    image1.SaveAs(path);
                    appeal.header_picture_path = "/Content/pic/appeals/" + fileName;
                }

                // Content image 1 (image2)
                if (image2 != null && image2.ContentLength > 0)
                {
                    if (!string.IsNullOrEmpty(appeal.content_picture1_path))
                    {
                        string oldFilePath = Server.MapPath(appeal.content_picture1_path);
                        if (System.IO.File.Exists(oldFilePath))
                            System.IO.File.Delete(oldFilePath);
                    }

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(image2.FileName);
                    string path = Path.Combine(folderPath, fileName);
                    image2.SaveAs(path);
                    appeal.content_picture1_path = "/Content/pic/appeals/" + fileName;
                }

                // Content image 2 (image3)
                if (image3 != null && image3.ContentLength > 0)
                {
                    if (!string.IsNullOrEmpty(appeal.content_picture2_path))
                    {
                        string oldFilePath = Server.MapPath(appeal.content_picture2_path);
                        if (System.IO.File.Exists(oldFilePath))
                            System.IO.File.Delete(oldFilePath);
                    }

                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(image3.FileName);
                    string path = Path.Combine(folderPath, fileName);
                    image3.SaveAs(path);
                    appeal.content_picture2_path = "/Content/pic/appeals/" + fileName;
                }

                int rows = db.SaveChanges();
                if (rows > 0)
                {
                    Session["appeal-updated"] = "true";
                    var redirect = Url.Action("AppealsList", "Appeals");
                    return Json(new { redirectTo = redirect });
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
        public JsonResult DeleteAppeal(long id)
        {
            try
            {
                Appeal appeal = db.Appeals.Where(a => a.appeal_id == id).FirstOrDefault();
                if (appeal == null)
                {
                    return Json("not found", JsonRequestBehavior.AllowGet);
                }

                // Delete header image
                if (!string.IsNullOrEmpty(appeal.header_picture_path))
                {
                    string filePath = Server.MapPath(appeal.header_picture_path);
                    if (System.IO.File.Exists(filePath))
                        System.IO.File.Delete(filePath);
                }

                // Delete content image 1
                if (!string.IsNullOrEmpty(appeal.content_picture1_path))
                {
                    string filePath = Server.MapPath(appeal.content_picture1_path);
                    if (System.IO.File.Exists(filePath))
                        System.IO.File.Delete(filePath);
                }

                // Delete content image 2
                if (!string.IsNullOrEmpty(appeal.content_picture2_path))
                {
                    string filePath = Server.MapPath(appeal.content_picture2_path);
                    if (System.IO.File.Exists(filePath))
                        System.IO.File.Delete(filePath);
                }

                // Remove record
                db.Appeals.Remove(appeal);
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
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

    }
}