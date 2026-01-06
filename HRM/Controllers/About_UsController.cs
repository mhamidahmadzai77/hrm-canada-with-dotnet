using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using iText.Kernel.Pdf;
using HRM.Models;
using System.IO;

namespace HRM.Controllers
{
    public class About_UsController : BaseController
    {
        // GET: About_Us

        HRMEntities db = new HRMEntities();
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Who_we_are()
        {
            return View();
        }

        public ActionResult AnnualReports()
        {
            var reports = db.Annual_Report.OrderByDescending(a => a.annual_report_id).ToList();
            return View(reports);
        }

        public FileResult DisplayReportImage(int id)
        {
            byte[] imageData = db.Annual_Report.Find(id).cover_image as byte[];
            return File(imageData, "image/jpeg");
        }


        public ActionResult Manage_Annual_Reports()
        {
            try
            {
                List<Annual_Report> reports = db.Annual_Report.ToList();
                return View(reports);
            }
            catch (Exception ex)
            {

            }
            return View();
        }

        [HttpPost]
        public JsonResult Add_Annual_Report(string year)
        {

            try
            {
                Annual_Report annualReport = new Annual_Report();
                annualReport.year = year;
                var image = Request.Files["imageFile"];
                if (image != null)
                {
                    byte[] imageByte = null;
                    BinaryReader reader = new BinaryReader(image.InputStream);
                    imageByte = reader.ReadBytes(image.ContentLength);
                    annualReport.cover_image = imageByte;
                }
                string fileName = "";
                string fullPath = "";
                var file = Request.Files["file"];
                if (file != null && file.ContentLength > 0)
                {
                    // Define the path where the file will be stored  
                    var path = Server.MapPath("~/Content/Reports/");

                    // Generate a unique file name or use the original one    
                    fileName = "HRM " + year + " annual report.pdf";
                    fullPath = Path.Combine(path, fileName);

                    // Save the file  
                    file.SaveAs(fullPath);

                    annualReport.fileName = fileName;
                }
                
                db.Annual_Report.Add(annualReport);
                int rows = db.SaveChanges();
                if (rows > 0)
                {
                    int id = db.Annual_Report.OrderByDescending(a => a.annual_report_id).FirstOrDefault().annual_report_id;
                    return Json(id, JsonRequestBehavior.AllowGet);

                }
                else
                {
                    return Json("did not save", JsonRequestBehavior.AllowGet);

                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }

        }

        
        public ActionResult Update_Annual_Report(int id)
        {
            Annual_Report report = db.Annual_Report.Where(a => a.annual_report_id == id).FirstOrDefault();

            return View(report);
        }

        [HttpPost]
        public JsonResult Update_Annual_Report(int id, string year, string size)
        {
            try
            {
                Annual_Report report = db.Annual_Report.FirstOrDefault(a => a.annual_report_id == id);

                string fileName = "";
                string fullPath = "";

                // Define the path where the file will be stored  
                var path = Server.MapPath("~/Content/Reports/");

                // Check if the directory exists, if not create it
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                // Generate a unique file name or use the original one  
                fileName = "HRM " + year + " annual report.pdf";

                if (size != "undefined")
                {
                    var file = Request.Files["file"];
                    if (file != null && file.ContentLength > 0)
                    {
                        fullPath = Path.Combine(path, fileName);

                        // Ensure the file isn't locked by another process
                        if (System.IO.File.Exists(fullPath))
                        {
                            System.IO.File.SetAttributes(fullPath, FileAttributes.Normal);
                        }

                        // Save the file
                        file.SaveAs(fullPath);
                    }
                }
                else
                {
                    // If new file wasn't uploaded, rename the existing file if it exists  
                    string existingFilePath = Path.Combine(path, report.fileName);

                    if (System.IO.File.Exists(existingFilePath))
                    {
                        // Remove the old file  
                        string newFilePath = existingFilePath.Replace(report.fileName, fileName);
                        if (System.IO.File.Exists(newFilePath))
                        {
                            System.IO.File.SetAttributes(newFilePath, FileAttributes.Normal);
                        }
                        System.IO.File.Move(existingFilePath, newFilePath);
                    }
                }

                // Update database record
                report.year = year;
                report.fileName = fileName;

                // Handle image upload (if any)
                var image = Request.Files["imageFile"];
                if (image != null)
                {
                    byte[] imageByte = null;
                    using (BinaryReader reader = new BinaryReader(image.InputStream))
                    {
                        imageByte = reader.ReadBytes(image.ContentLength);
                    }
                    report.cover_image = imageByte;
                }

                // Save changes to the database
                db.SaveChanges();

                // Indicate success and redirect
                Session["reportUpdated"] = "true";
                var redirect = Url.Action("Manage_Annual_Reports", "About_Us");
                return Json(new
                {
                    redirectTo = redirect
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                // Handle access denied specifically
                return Json("Access denied: " + ex.Message, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // Generic exception handling
                return Json("Error: " + ex.Message, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult DeleteAnnualReport(int id)
        {
            try
            {
                Annual_Report annual_Report = db.Annual_Report.Where(a => a.annual_report_id == id).FirstOrDefault();
                string fileName = annual_Report.fileName;
                db.Annual_Report.Remove(annual_Report);
                int deletedRecords = db.SaveChanges();
                if (deletedRecords > 0)
                {
                    // Define the path where the files are stored  
                    var path = Server.MapPath("~/Content/Reports/");
                    var filePath = Path.Combine(path, fileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        // Delete the file  
                        System.IO.File.Delete(filePath);

                    }
                    return Json("deleted", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json("does not delete", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        public FilePathResult DownloadReport(string report)
        {
            Annual_Report HRMreport =  db.Annual_Report.Where(a => a.fileName == report).FirstOrDefault();
            string filePath = Server.MapPath("~/Content/Reports/" + HRMreport.fileName + "");
            return new FilePathResult(filePath, "application/pdf");
        }

        

        public ActionResult Our_Policies()
        {
            var policy = db.Policies.ToList();
            return View(policy);
        }

        public ActionResult Manage_Policies()
        {
            try
            {
                List<Policy> policies = db.Policies.ToList();
                return View(policies);
            }
            catch (Exception ex)
            {

            }
            return View();
        }

        [HttpPost]
        public JsonResult Add_Policy(string policyName, string size)
        {

            try
            {
                Policy policy = new Policy();

                string fileName = "";
                string fullPath = "";
                int pageCount = 0;
                string fileType = "";
                var file = Request.Files["file"];
                if (file != null && file.ContentLength > 0)
                {
                    fileType = file.ContentType;
                    // Define the path where the file will be stored  
                    var path = Server.MapPath("~/Content/HRM-Policies/");

                    // Generate a unique file name or use the original one  
                    fileName = policyName + ".pdf";
                    fullPath = Path.Combine(path, fileName);

                    // Save the file  
                    file.SaveAs(fullPath);

                    using (var reader = new PdfReader(file.InputStream))
                    using (var pdfDoc = new PdfDocument(reader))
                    {
                        pageCount = pdfDoc.GetNumberOfPages();

                    }

                    policy.fileName = fileName;
                    policy.pages = pageCount;
                    policy.file_type = fileType;
                    policy.file_size = size;

                }
                
                policy.policy_name = policyName;
                db.Policies.Add(policy);
                int rows = db.SaveChanges();
                if (rows > 0)
                {
                    int id = db.Annual_Report.OrderByDescending(a => a.annual_report_id).FirstOrDefault().annual_report_id;
                    return Json(id, JsonRequestBehavior.AllowGet);

                }
                else
                {
                    return Json("did not save", JsonRequestBehavior.AllowGet);

                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }

        }


        public ActionResult Update_Policy(int id)
        {
            Policy policy = db.Policies.Where(a => a.policy_id == id).FirstOrDefault();

            return View(policy);
        }

        [HttpPost]
        public JsonResult Update_Policy(int id, string policyName, string size)
        {
            try
            {
                Policy policy = db.Policies.FirstOrDefault(a => a.policy_id == id);

                string fileName = "";
                string fullPath = "";
                int pageCount = 0;
                string fileType = "";
                
                if (size != "undefined")
                {
                    var file = Request.Files["file"];
                    if (file != null && file.ContentLength > 0)
                    {
                        fileType = file.ContentType;
                        // Define the path where the file will be stored  
                        var path = Server.MapPath("~/Content/HRM-Policies/");

                        // Generate a unique file name or use the original one  
                        fileName = policyName + ".pdf";
                        fullPath = Path.Combine(path, fileName);

                        // Save the file  
                        file.SaveAs(fullPath);


                        using (var reader = new PdfReader(file.InputStream))
                        using (var pdfDoc = new PdfDocument(reader))
                        {
                            pageCount = pdfDoc.GetNumberOfPages();
                        }

                        policy.fileName = fileName;
                        policy.pages = pageCount;
                        policy.file_type = fileType;
                        policy.file_size = size;

                    }
                }
                policy.policy_name = policyName;
                db.SaveChanges();

                Session["policyUpdated"] = "true";
                var redirect = Url.Action("Manage_Policies", "About_Us");
                return Json(new
                {
                    redirectTo = redirect
                });

            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult DeletePolicy(int id)
        {
            try
            {
                Policy policy = db.Policies.Where(p => p.policy_id== id).FirstOrDefault();
                string fileName = policy.fileName;
                db.Policies.Remove(policy);
                int deletedRecords = db.SaveChanges();
                if (deletedRecords > 0)
                {
                    // Define the path where the files are stored  
                    var path = Server.MapPath("~/Content/HRM-Policies/");
                    var filePath = Path.Combine(path, fileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        // Delete the file  
                        System.IO.File.Delete(filePath);

                    }
                    return Json("deleted", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json("does not delete", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        public FilePathResult DownloadPolicy(string policy)
        {
            Policy HRMPolicy = db.Policies.Where(p => p.policy_name == policy).FirstOrDefault();
            string filePath = Server.MapPath("~/Content/HRM-Policies/" + HRMPolicy.fileName + "");
            return new FilePathResult(filePath, "application/pdf");
        }


        // GET: About-Us/Our-Work
        public ActionResult Our_Work()
        {
            ViewBag.Title = "Local Community Work";
            return View();
        }


        public ActionResult FrequentlyAskedQuestion()
        {
            return View();
        }




    }
}