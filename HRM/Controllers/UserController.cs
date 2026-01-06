using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HRM.Models;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace HRM.Controllers
{
    public class UserController : BaseController
    {
        HRMEntities db = new HRMEntities();



        // GET: User
        public ActionResult Index()
        {

            return View();
        }

        public ActionResult AdminLoginView()
        {
            return View();
        }


        public ActionResult LoginView()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Login(User user)
        {
            try
            {
                var u = db.Users.Where(e => e.username == user.username && e.password == user.password).FirstOrDefault();
                if (u != null)
                {


                    Session["user_108310113658"] = "authenticated";
                    Session["user_id"] = u.user_id;
                    Session["username"] = u.username;
                    Session["password"] = u.password;
                    Session["email"] = u.email;
                    Session["image"] = u.image;
                    
                        var redirect = Url.Action("Index", "Home");
                        return Json(new
                        {
                            redirectTo = redirect
                        });
                    

                }
                else
                {
                        return Json("InvalidAccount", JsonRequestBehavior.AllowGet);

                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        public FileResult DisplayImage()
        {
            byte[] imageData = Session["image"] as byte[];
            return File(imageData, "image/jpeg");
        }
        [HttpPost]
        public JsonResult DeleteImage()
        {
            try
            {
                string email = Session["email"].ToString();
                string username = Session["username"].ToString();
                User user = db.Users.Where(u => u.email == email && u.username == username).FirstOrDefault();
                user.image = null;
                int count = db.SaveChanges();
                if (count > 0)
                {
                    Session["image"] = null;
                    Session["imageState"] = "deleted";
                    var redirect = Url.Action("MyProfile", "User");
                    return Json(new
                    {
                        redirectTo = redirect
                    });
                }
                else
                {
                    return Json(false, JsonRequestBehavior.AllowGet);
                }


            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult SigninView()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Signup(string username, string password, string email)
        {
            try
            {

                // First check email address that is there any account made by this email
                User u = db.Users.Where(a => a.email == email).FirstOrDefault();
                if (u != null)
                {
                    return Json("emailConflict", JsonRequestBehavior.AllowGet);

                }



                var file = Request.Files["file"];

                User user = new User();
                user.username = username;
                user.password = password;
                user.email = email;
                
                if (file != null && file.ContentLength > 0)
                {
                    /*string fileName = Guid.NewGuid() + Path.GetFileName(file.FileName);
                    string filePath = Path.Combine(Server.MapPath("~/assets/pic/"), fileName);
                    file.SaveAs(filePath);*/

                    byte[] imageByte = null;
                    BinaryReader reader = new BinaryReader(file.InputStream);
                    imageByte = reader.ReadBytes(file.ContentLength);

                    user.image = imageByte;
                }
                else
                {
                    user.image = null;
                }
                db.Users.Add(user);
                int res = db.SaveChanges();
                if (res > 0)
                {
                    var redirect = Url.Action("Index", "Home");
                    return Json(new
                    {
                        redirectTo = redirect
                    });
                }
                else
                {
                    return Json("did not save user", JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                // Handle exception
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }
        

        public ActionResult Logout()
        {

            // destroy the all sessions
            Session.Abandon();
            return RedirectToAction("Index", "Home");
        }

        public ActionResult ResetPasswordView()
        {
            return View();
        }
        [HttpPost]
        public JsonResult ResetPassword(User u)
        {
            User user = db.Users.Where(s => s.email == u.email).FirstOrDefault();
            if (user == null)
            {
                // if username and email doesn't match with any account in database  
                return Json("incorrect email", JsonRequestBehavior.AllowGet);
            }
            else
            {
                // Generates 6 random number between 100000 and 999999  
                Random random = new Random();
                string newPassword = random.Next(100000, 999999).ToString();

                // Update Password  
                user.password = newPassword;
                int affectedRows = db.SaveChanges();
                if (affectedRows > 0)
                {
                    // Sender's email address and password  
                    string senderEmail = "admin@humanreliefmission.com";
                    string senderPassword = "fiiwtbnznxzqeasq"; // Don't hardcode in production!  

                    // Recipient's email address  
                    string recipientEmail = u.email;

                    using (var client = new SmtpClient())
                    {
                        var mailMessage = new MailMessage
                        {
                            From = new MailAddress(senderEmail),
                            Subject = "Password Changed",
                            Body = GenerateEmailBody(user.username, newPassword),
                            IsBodyHtml = true, // Set to true if you're sending HTML email  
                        };

                        mailMessage.To.Add(recipientEmail);

                        client.Host = "smtp.gmail.com"; // Set SMTP server  
                        client.Port = 587; // Port number  
                        client.Credentials = new NetworkCredential(senderEmail, senderPassword);
                        client.EnableSsl = true; // Use SSL if required by your provider  

                        try
                        {
                            // Send the email synchronously  
                            client.Send(mailMessage);

                            // Email sent successfully  
                            Session["email"] = user.email;
                            var redirectTo = Url.Action("ConfirmPasswordView", "User");
                            return Json(new
                            {
                                redirectTo = redirectTo
                            });
                        }
                        catch (Exception ex)
                        {
                            // Handle your exception here  
                            return Json("Error sending email: " + ex.Message, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
                else
                {
                    return Json("password did not change", JsonRequestBehavior.AllowGet);
                }
            }
        }
        public ActionResult ConfirmPasswordView()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ConfirmPassword(string password)
        {
            try
            {
                string email = Session["email"].ToString();

                User user = db.Users.Where(s => s.password == password && s.email == email).FirstOrDefault();
                if (user == null)
                {
                    // if username and email doesn't match with any account in database
                    return Json("incorrect password", JsonRequestBehavior.AllowGet);

                }
                else
                {
                    Session["user_108310113658"] = "authenticated";
                    Session["user_id"] = user.user_id;
                    Session["username"] = user.username;
                    Session["email"] = user.email;
                    Session["image"] = user.image;
                    var redirect = Url.Action("Index", "Home");
                    return Json(new
                    {
                        redirectTo = redirect
                    });
                }

            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult MyProfile()
        {
            string email = Session["email"].ToString();
            string username = Session["username"].ToString();
            var user = db.Users.Where(u => u.email == email && u.username == username).FirstOrDefault();

            return View(user);
            
        }

        [HttpPost]
        public JsonResult EditPersonalInfo(User user)
        {
            var email = Session["email"].ToString();
            var username = Session["username"].ToString();

            // Exception Handling
            try
            {
                User u = db.Users.Where(us => us.username == username && us.email == email).FirstOrDefault();
                u.username = user.username;
                u.email = user.email;
                int affectedRows = db.SaveChanges();

                if (affectedRows > 0)
                {
                    Session["username"] = user.username;
                    Session["email"] = user.email;
                    var redirectTo = Url.Action("MyProfile", "User");
                    return Json(new
                    {
                        redirectTo = redirectTo
                    });

                }
                else
                {
                    return Json("did not update", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.ToString(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult EditPassword(string currentPassword, string newPassword)
        {

            try
            {
                var username = Session["username"].ToString();
                var email = Session["email"].ToString();
                var oldPassword = currentPassword;

                User user = db.Users.Where(u => u.username == username && u.email == email && u.password == oldPassword).FirstOrDefault();
                if (user == null)
                {
                    return Json("incorrect password entered", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    user.password = newPassword;
                    db.SaveChanges();

                    Session["password"] = newPassword;
                    return Json("password changed", JsonRequestBehavior.AllowGet);



                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }

        [HttpPost]
        public JsonResult ChangeImage()
        {
            try
            {
                string username = Session["username"].ToString();
                string email = Session["email"].ToString();
                var user = db.Users.FirstOrDefault(u => u.username == username && u.email == email);
                if (user == null)
                {
                    return Json("entity not found", JsonRequestBehavior.AllowGet);
                }

                var file = Request.Files["image"];
                if (file != null && file.ContentLength > 0)
                {

                    using (var reader = new BinaryReader(file.InputStream))
                    {
                        user.image = reader.ReadBytes(file.ContentLength);
                    }
                    int count = db.SaveChanges();
                    if (count > 0)
                    {
                        Session["imageState"] = "updated";
                        Session["image"] = user.image;
                        var redirect = Url.Action("MyProfile", "User");
                        return Json(new
                        {
                            redirectTo = redirect
                        });
                    }
                    else
                    {
                        return Json("image not changed", JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {

                    return Json("file not selected", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }


        }

        public ActionResult UserView()
        {
            var users = db.Users.Where(u => u.user_id != 0).ToList();
            return View(users);
        }

        [HttpPost]
        public JsonResult DeleteUser(int id)
        {
            try
            {

                User user = db.Users.Where(u => u.user_id == id).FirstOrDefault();
                db.Users.Remove(user);
                int count = db.SaveChanges();
                if (count > 0)
                {
                    return Json(true, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(false, JsonRequestBehavior.AllowGet);

                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
        }


        public FileResult DisplayEditingUserImage()
        {
            byte[] imageData = Session["EditingUserImage"] as byte[];
            return File(imageData, "image/jpeg");
        }


        public ActionResult EditUser(int id)
        {
            try
            {
                User user = db.Users.Find(id);
                if (user != null)
                {

                    Session["EditingUserImage"] = user.image;
                    ViewBag.user_id = user.user_id;
                    ViewBag.username = user.username;
                    ViewBag.email = user.email;
                    
                    return View();
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }
            catch (Exception ex)
            {
                return View(ex.Message);
            }
        }


        [HttpPost]
        public JsonResult EditUserInfo(User user)
        {
            try
            {
                User us = db.Users.Find(user.user_id);
                us.username = user.username;
                us.email = user.email;
                
                int count = db.SaveChanges();
                if (count > 0)
                {
                    Session["changed"] = "true";
                    var redirect = Url.Action("UserView", "User");
                    return Json(new
                    {
                        redirectTo = redirect,
                    });
                }
                else
                {
                    return Json(false, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }

        public string GenerateEmailBody(string userName, string newPassword)
        {
            return $@"  
            <html>  
            <head>  
                <meta charset='UTF-8'>  
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>  
                <title>New Password Notification</title>  
                <style>  
                    body {{  
                        font-family: Arial, sans-serif;  
                        background-color: #f9f9f9;  
                        margin: 0;  
                        padding: 20px;  
                    }}  
                    .container {{  
                        max-width: 600px;  
                        margin: auto;  
                        padding: 20px;  
                        background-color: #ffffff;  
                        border-radius: 8px;  
                        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);  
                    }}  
                    h1 {{  
                        color: #2c3e50;  
                    }}  
                    p {{  
                        font-size: 16px;  
                        line-height: 1.6;  
                        color: #34495e;  
                    }}  
                    .new-password {{  
                        color: #e74c3c;  
                        font-weight: bold;  
                        font-size: 18px;  
                    }}  
                    .footer {{  
                        font-size: 14px;  
                        margin-top: 20px;  
                        color: #888888;  
                        text-align: center;  
                    }}  
                </style>  
            </head>  
            <body>  
                <div class='container'>  
                    <h1>Your New Password</h1>  
                    <p>Dear <strong>{userName}</strong>,</p>  
                    <p>Your password has been successfully reset. Your new password is:</p>  
                    <p class='new-password'> {newPassword} </p>  
                    <p>For security reasons, we recommend that you change this password after logging in.</p>  
                    <p>Best regards,<br>Human Relief Mission</p>  
                    <div class='footer'>  
                        <p>This is a system-generated email, please do not reply.</p>  
                    </div>  
                </div>  
            </body>  
            </html>";
        }
    }
}