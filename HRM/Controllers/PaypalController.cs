using HRM.Models;
using PayPal.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HRM.Models;
using Newtonsoft.Json;
using System.Net.Mail;
using System.Net;
using System.Diagnostics;

namespace HRM.Controllers
{

    public class PaypalController : Controller
    {
        HRMEntities db = new HRMEntities();
        private const string BasketCookieKey = "BasketCookie";


        public ActionResult PaymentWithPaypal(Donor donor)
        {
            if (donor.donor_firstname != null)
            {
                Session["DonorInformation"] = donor;

            }

            //getting the apiContext  
            APIContext apiContext = PaypalConfiguration.GetAPIContext();
            try
            {
                //A resource representing a Payer that funds a payment Payment Method as paypal  
                //Payer Id will be returned when payment proceeds or click to pay  
                string payerId = Request.Params["PayerID"];
                if (string.IsNullOrEmpty(payerId))
                {
                    //this section will be executed first because PayerID doesn't exist  
                    //it is returned by the create function call of the payment class  
                    // Creating a payment  
                    // baseURL is the url on which paypal sendsback the data.  
                    string baseURI = Request.Url.Scheme + "://" + Request.Url.Authority + "/Paypal/PaymentWithPayPal?";
                    //here we are generating guid for storing the paymentID received in session  
                    //which will be used in the payment execution  
                    var guid = Convert.ToString((new Random()).Next(100000));
                    //CreatePayment function gives us the payment approval url  
                    //on which payer is redirected for paypal account payment  
                    var createdPayment = this.CreatePayment(apiContext, baseURI + "guid=" + guid);
                    //get links returned from paypal in response to Create function call  
                    var links = createdPayment.links.GetEnumerator();
                    string paypalRedirectUrl = null;
                    while (links.MoveNext())
                    {
                        Links lnk = links.Current;
                        if (lnk.rel.ToLower().Trim().Equals("approval_url"))
                        {
                            //saving the payapalredirect URL to which user will be redirected for payment  
                            paypalRedirectUrl = lnk.href;
                        }
                    }
                    // saving the paymentID in the key guid  
                    Session["payment"] = createdPayment.id;
                    return Redirect(paypalRedirectUrl);
                }
                else
                {
                    // This function exectues after receving all parameters for the payment  
                    var guid = Request.Params["guid"];
                    var executedPayment = ExecutePayment(apiContext, payerId, Session["payment"] as string);
                    //If executed payment failed then we will show payment failure message to user  
                    if (executedPayment.state.ToLower() != "approved")
                    {
                        return View("FailureView");
                    }
                }
            }
            catch (Exception ex)
            {
                return View("FailureView");
            }
            // Payment is completed successfully 
            // Save donor's data in database and send thank you email to the donor.
            donor = Session["DonorInformation"] as Donor;
            if (donor.donation_type == "one-off")
            {
                #region 
                // Get basket data
                var cookie = Request.Cookies[BasketCookieKey];
                var basket = new List<DonationItem>();
                if (cookie != null)
                {
                    basket = JsonConvert.DeserializeObject<List<DonationItem>>(cookie.Value);
                }
                ViewBag.basket = basket;
                #endregion
                if (ViewBag.basket != null && ((List<DonationItem>)ViewBag.basket).Any())
                {
                    int count = 0;
                    int total = 0;
                    string name = "";
                    count = ViewBag.basket.Count;
                    foreach (DonationItem item in (List<DonationItem>)ViewBag.basket)
                    {
                        total = total + Convert.ToInt32(item.Amount);
                        count--;
                        if (count == 1)
                        {
                            name = name + item.Name + " and ";

                        }
                        else if (count == 0)
                        {
                            name = name + item.Name;

                        }
                        else
                        {
                            name = name + item.Name + ", ";
                        }
                    }

                    donor.project_name = name;

                }
            }

            donor.createdAt = System.DateTime.Now;
            try
            {
                var donorInfo = GetDonorInfo(donor.email);

                // Process the donation (one-off or subscription)  
                if (donor.donation_type == "one-off")
                {

                    try
                    {
                        // Store donor information in database

                        if (donor.taxpayer != null && donor.taxpayer != "")
                        {
                            donor.taxpayer = "Yes";
                        }
                        else
                        {
                            donor.taxpayer = "No";
                        }
                        db.Donors.Add(donor);
                        int saved = db.SaveChanges();

                        // Set donation session to visible success page
                        Session["donation"] = true;
                        Session["DonorInformation"] = null;

                        if (saved > 0)
                        {
                            if (donor.donation_type == "one-off")
                            {
                                // Empty basket session and basket viewbag
                                Response.Cookies[BasketCookieKey].Expires = DateTime.Now.AddDays(-1); // Expire the cookie  
                                ViewBag.basket = null;
                            }

                            // After donation is successful, send confirmation email  
                            // Sender's email address and password
                            string senderEmail = "donate@humanreliefmission.com";
                            string senderPassword = "khrynbxpvfdlvvcu";

                            // Recipient's email address
                            string recipientEmail = donor.email;


                            using (var client = new SmtpClient())
                            {
                                var mailMessage = new MailMessage
                                {
                                    From = new MailAddress(senderEmail),
                                    Subject = "Donation Confirmation",
                                    Body = GenerateEmailBody(donor.donor_firstname + " " + donor.donor_surname, donor.amount),
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

                                }
                                catch (Exception ex)
                                {
                                    throw;
                                }
                            }

                        }
                        // Redirect to thank you or donation success page
                        return Redirect("Success");

                    }
                    catch (Exception ex)
                    {
                        // Handle the Stripe exception  
                        ModelState.AddModelError(string.Empty, $"Error processing payment: {ex.Message}");
                    }
                }
                else if (donor.donation_type == "monthly")
                {

                    try
                    {

                        // Store donor information in database

                        if (donor.taxpayer != null && donor.taxpayer != "")
                        {
                            donor.taxpayer = "Yes";
                        }
                        else
                        {
                            donor.taxpayer = "No";
                        }
                        db.Donors.Add(donor);
                        int saved = db.SaveChanges();

                        // Set donation session to visible success page
                        Session["donation"] = true;
                        Session["DonorInformation"] = null;

                        if (saved > 0)
                        {
                            // Empty basket session and basket viewbag
                            Response.Cookies[BasketCookieKey].Expires = DateTime.Now.AddDays(-1); // Expire the cookie  
                            ViewBag.basket = null;

                            // After donation is successful, send confirmation email  
                            // Sender's email address and password
                            string senderEmail = "donate@humanreliefmission.com";
                            string senderPassword = "khrynbxpvfdlvvcu";

                            // Recipient's email address
                            string recipientEmail = donor.email;


                            using (var client = new SmtpClient())
                            {
                                var mailMessage = new MailMessage
                                {
                                    From = new MailAddress(senderEmail),
                                    Subject = "Donation Confirmation",
                                    Body = GenerateEmailBody(donor.donor_firstname + " " + donor.donor_surname, donor.amount),
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

                                }
                                catch (Exception ex)
                                {
                                    // Handle your exception here  
                                    throw;
                                }
                            }
                        }
                        // Redirect to thank you or donation success page
                        return Redirect("Success");
                    }
                    catch (Exception ex)
                    {
                        ModelState.AddModelError(string.Empty, $"Error processing subscription: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return Redirect("Success");


        }
        private PayPal.Api.Payment payment;
        private Payment ExecutePayment(APIContext apiContext, string payerId, string paymentId)
        {
            var paymentExecution = new PaymentExecution()
            {
                payer_id = payerId
            };
            this.payment = new Payment()
            {
                id = paymentId
            };
            return this.payment.Execute(apiContext, paymentExecution);
        }
        private Payment CreatePayment(APIContext apiContext, string redirectUrl)
        {
            Donor donor = Session["DonorInformation"] as Donor;
            string finalAmount = string.Format("{0:0.00}", donor?.amount ?? 0);

            var itemList = new ItemList
            {
                items = new List<Item>
        {
            new Item
            {
                name = "Donation",
                currency = "GBP",
                price = string.Format("{0:0.00}", donor?.amount ?? 0),
                quantity = "1",
                sku = "sku"
            }
        }
            };

            var payer = new Payer { payment_method = "paypal" };
            var redirUrls = new RedirectUrls
            {
                cancel_url = redirectUrl + "&Cancel=true",
                return_url = redirectUrl
            };

           
            var amount = new Amount
            {
                currency = "GBP",
                total = finalAmount
            };

            var transactionList = new List<Transaction>
    {
        new Transaction
        {
            description = "Donation Payment",
            invoice_number = Guid.NewGuid().ToString(),
            amount = amount,
            item_list = itemList
        }
    };

            try
            {
                return new Payment
                {
                    intent = "sale",
                    payer = payer,
                    transactions = transactionList,
                    redirect_urls = redirUrls
                }.Create(apiContext);
            }
            catch (PayPal.PaymentsException ex)
            {
                Debug.WriteLine("PayPal API Error: " + ex.Response);
                throw;
            }
        }




        // Assuming you have a method to get the donor's information  
        private Donor GetDonorInfo(string email)
        {
            try
            {
                Donor donor = db.Donors.Where(d => d.email == email).FirstOrDefault();
                return donor;
            }
            catch (System.Exception)
            {

                throw;
            }
        }

        public ActionResult Success()
        {
            return View();
        }

        public string GenerateEmailBody(string donorName, decimal donationAmount)
        {
            return $@"  
    <html>  
    <head>  
        <meta charset='UTF-8'>  
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>  
        <title>Donation Confirmation</title>  
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
            .amount {{  
                color: #e74c3c; /* A vibrant color for the donation amount */  
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
            <h1>Thank You for Your Donation!</h1>  
            <p>Dear <strong>{donorName}</strong>,</p>  
            <p>Thank you for your generous donation of <span class='amount'>£{donationAmount:0.00}</span>.</p>  
            <p>Your support is invaluable in helping us achieve our mission.</p>  
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