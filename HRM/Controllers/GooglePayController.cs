using HRM.Models;
using Newtonsoft.Json;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web.Http;
using System.Web.Mvc;

public class GooglePay : Controller
{
    HRMEntities db = new HRMEntities();
    private const string BasketCookieKey = "BasketCookie";


    [System.Web.Http.HttpPost]
    public ActionResult ProcessPaymentWithGooglePay([FromBody] PaymentDataModel paymentData, Donor donor)
    {
        try
        {
            // Set your Stripe secret key
            StripeConfiguration.ApiKey = "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";

            // Ensure donor amount is correctly provided
            if (donor == null || donor.amount <= 0)
            {
                return Json(new { success = false, message = "Invalid amount provided." });
            }
            paymentData.TotalPrice = Convert.ToDecimal(donor.amount);
            if (donor.donation_type == "monthly")
            {
                // Step 1: Create a Customer
                var customerOptions = new CustomerCreateOptions
                {
                    Email = donor.email, // Assuming donor has an Email property
                    Source = paymentData.PaymentMethodData // Token ID from Google Pay
                };
                var customerService = new CustomerService();
                var customer = customerService.Create(customerOptions);

                // Step 2: Create a Subscription for the Customer
                var subscriptionOptions = new SubscriptionCreateOptions
                {
                    Customer = customer.Id,
                    Items = new List<SubscriptionItemOptions>
        {
            new SubscriptionItemOptions
            {
                PriceData = new SubscriptionItemPriceDataOptions
                {
                    UnitAmount = (long)(paymentData.TotalPrice * 100), // Amount in cents
                    Currency = paymentData.CurrencyCode,
                    Recurring = new SubscriptionItemPriceDataRecurringOptions
                    {
                        Interval = "month" // Monthly interval
                    }
                }
            }
        }
                };

                var subscriptionService = new SubscriptionService();
                Subscription subscription = subscriptionService.Create(subscriptionOptions);

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
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, $"Error processing subscription: {ex.Message}");
                }

                // Redirect to thank you or donation success page
                var redirect = Url.Action("Success", "GooglePay");
                return Json(new
                {
                    redirectTo = redirect
                });
            }

            else
            {
                // One-time charge
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
                var chargeOptions = new ChargeCreateOptions
                {
                    Amount = (long)(paymentData.TotalPrice * 100), // Amount in cents
                    Currency = paymentData.CurrencyCode,
                    Source = paymentData.PaymentMethodData, // Token ID from Google Pay
                    Description = "One-Time Payment from Google Pay",
                };

                var chargeService = new ChargeService();
                Charge charge = chargeService.Create(chargeOptions);
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


                        }
                        catch (Exception ex)
                        {
                            // Handle the Stripe exception  
                            ModelState.AddModelError(string.Empty, $"Error processing payment: {ex.Message}");
                        }
                    }
                }
                catch (Exception ex)
                {

                    throw;
                }
                // Redirect to thank you page
                var redirect = Url.Action("Success", "GooglePay");
                return Json(new
                {
                    redirectTo = redirect
                });


            }
        }
        catch (StripeException stripeEx)
        {
            // Handle Stripe-specific errors
            return Json(new { success = false, message = stripeEx.Message });
        }
        catch (Exception ex)
        {
            // Handle general errors
            return Json(new { success = false, message = ex.Message });
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

    public ActionResult Success()
    {
        return View();
    }

}
