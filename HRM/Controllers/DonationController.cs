using System.Web.Mvc;
using System.Collections.Generic;
using Stripe;
using HRM.Models;
using System.Linq;
using System;
using System.Net.Mail;
using System.Net;
using Newtonsoft.Json;
using HRM.Controllers;
public class DonationController : BaseController
{
    HRMEntities db = new HRMEntities();

    private const string BasketCookieKey = "BasketCookie";

    public ActionResult Index()
    {
        return View();
    }

    public ActionResult Donate_Start()
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

        // Retrieve the Donation object from TempData  
        var donation = TempData["Donation"] as Donation;

        // Pass the donation object to the view  
        return View(donation);
    }

    [HttpPost]
    public JsonResult Donate_Start(string donationType, string name, int amount)
    {
        if (donationType == "monthly")
        {
            Response.Cookies[BasketCookieKey].Expires = DateTime.Now.AddDays(-1); // Expire the cookie  
        }
        // Assign values of Donation  
        Donation getDonation = new Donation
        {
            DonationType = donationType,
            Name = name,
            Amount = amount
        };

        // Store it in TempData  
        TempData["Donation"] = getDonation;

        // Redirect to donation page  
        var redirect = Url.Action("Donate_Start", "Donation");
        return Json(new
        {
            redirectTo = redirect
        });
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

    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult ProcessDonation(Donor donor, Donation donation, string stripeToken)
    {
        if (donation.DonationType == "one-off")
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
                donor.amount = Convert.ToInt64(total);
                donor.project_name = name;
                donation.Amount = Convert.ToDecimal(total);
                donation.Name = name;
            }
        }

        donor.createdAt = System.DateTime.Now;
        try
        {
            if (!string.IsNullOrEmpty(stripeToken))
            {
                // Test mode
                //StripeConfiguration.ApiKey = "sk_test_51Ps1NjIYwqj9hFz9TqVLxuagsgbUlgssltMmXXdZ0c36xoiLFQ1mHMibM0w8GEt8XY5prNaarcwreET1SdW5Vh5Q009FTvFasn";
                // Live mode
                StripeConfiguration.ApiKey = "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";

                // Initialize the Stripe services  
                var customerService = new CustomerService();
                var paymentMethodService = new PaymentMethodService();

                var donorInfo = GetDonorInfo(donation.Email);
                string customerId;

                // Create a PaymentMethod from the token  
                var paymentMethodOptions = new PaymentMethodCreateOptions
                {
                    Type = "card",
                    Card = new PaymentMethodCardOptions
                    {
                        Token = stripeToken, // Use the token here  
                    },
                };

                PaymentMethod paymentMethod = paymentMethodService.Create(paymentMethodOptions);

                if (donor == null || string.IsNullOrEmpty(donor.customerID))
                {
                    var customerOptions = new CustomerCreateOptions
                    {
                        Email = donation.Email,
                        Name = donation.Name,
                        Description = "Donation from" + donation.Email + " for " + donor.project_name,
                        PaymentMethod = paymentMethod.Id, // Attach the created PaymentMethod here  
                    };

                    Customer customer = customerService.Create(customerOptions);
                    customerId = customer.Id;

                    SaveDonorCustomerId(donation.Email, customerId);

                    // Set the default payment method for the customer  
                    var options = new CustomerUpdateOptions
                    {
                        InvoiceSettings = new CustomerInvoiceSettingsOptions
                        {
                            DefaultPaymentMethod = paymentMethod.Id, // Set as default payment method  
                        },
                    };
                    customerService.Update(customerId, options);
                }
                else
                {
                    customerId = donor.customerID;

                    // Attach the payment method to the existing customer and set it as default  
                    var attachOptions = new PaymentMethodAttachOptions
                    {
                        Customer = customerId,
                    };
                    paymentMethodService.Attach(paymentMethod.Id, attachOptions);

                    // Set the default payment method for the existing customer  
                    var updateOptions = new CustomerUpdateOptions
                    {
                        InvoiceSettings = new CustomerInvoiceSettingsOptions
                        {
                            DefaultPaymentMethod = paymentMethod.Id,
                        },
                    };
                    customerService.Update(customerId, updateOptions);
                }

                // Process the donation (one-off or subscription)  
                if (donor.donation_type == "one-off")
                {
                    var paymentIntentOptions = new PaymentIntentCreateOptions
                    {
                        Amount = (long)(donation.Amount * 100), // Amount in cents  
                        Currency = "gbp",
                        Customer = customerId, // Use the customer ID  
                        PaymentMethod = paymentMethod.Id, // Specify the PaymentMethod ID directly  
                        OffSession = true, // Indicate we're charging this payment method off-session  
                        Confirm = true, // Confirm the payment  
                    };

                    var paymentIntentService = new PaymentIntentService();

                    try
                    {
                        PaymentIntent paymentIntent = paymentIntentService.Create(paymentIntentOptions);
                        if (paymentIntent.Status == "succeeded")
                        {
                            // Store donor information in database
                            donor.customerID = customerId;
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

                            if (saved > 0)
                            {
                                if (donation.DonationType == "one-off")
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
                                        // Handle your exception here  
                                        return Json("Error sending email: " + ex.Message, JsonRequestBehavior.AllowGet);
                                    }
                                }

                            }
                            // Redirect to thank you or donation success page
                            var redirect = Url.Action("Success", "Donation");
                            return Json(new
                            {
                                redirectTo = redirect
                            });
                        }
                    }
                    catch (StripeException ex)
                    {
                        // Handle the Stripe exception  
                        ModelState.AddModelError(string.Empty, $"Error processing payment: {ex.Message}");
                    }
                }
                else if (donor.donation_type == "monthly")
                {
                    // Check if the price exists in your database  
                    string priceId = CheckIfPriceExists(donation.Amount);
                    if (priceId == null)
                    {
                        // Create a new price in Stripe  
                        var priceOptions = new PriceCreateOptions
                        {
                            UnitAmount = (long)(donation.Amount * 100), // Amount in cents  
                            Currency = "gbp", // Set your currency  
                            Recurring = new PriceRecurringOptions
                            {
                                Interval = "month", // Set the billing interval  
                            },
                            /*Product = "prod_QnvkaCZDaK2C2O", // Test mode*/
                            Product = "prod_QyjYDP8PL8skwj", // Live mode
                        };
                        var priceService = new PriceService();
                        Stripe.Price price = priceService.Create(priceOptions);
                        priceId = price.Id;

                        // Store the new price ID in your database  
                        StorePriceInDatabase(donation.Amount, priceId);
                    }

                    // Create the subscription using the priceId  
                    var subscriptionOptions = new SubscriptionCreateOptions
                    {
                        Customer = customerId,
                        Items = new List<SubscriptionItemOptions>
                        {
                            new SubscriptionItemOptions
                            {
                                Price = priceId,
                            },
                        },
                    };

                    var subscriptionService = new SubscriptionService();
                    try
                    {
                        Subscription subscription = subscriptionService.Create(subscriptionOptions);
                        if (subscription.Status == "active")
                        {

                            // Store donor information in database
                            donor.customerID = customerId;
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
                                        return Json("Error sending email: " + ex.Message, JsonRequestBehavior.AllowGet);
                                    }
                                }
                            }
                            // Redirect to thank you or donation success page
                            var redirect = Url.Action("Success", "Donation");
                            return Json(new
                            {
                                redirectTo = redirect
                            });
                        }
                    }
                    catch (StripeException ex)
                    {
                        ModelState.AddModelError(string.Empty, $"Error processing subscription: {ex.Message}");
                    }
                }
            }
        }
        catch (Exception ex)
        {

            throw;
        }
        
        return View("ProcessDonation", donation);
    }
    private void SaveDonorCustomerId(string email, string customerId)
    {
        // Implement logic to save the customer ID associated with the donor's email in your database  
        try
        {
            StripeCustomerId customer = new StripeCustomerId();
            customer.email = email;
            customer.customerId = customerId;
            db.StripeCustomerIds.Add(customer);
            db.SaveChanges();
        }
        catch (System.Exception)
        {

            throw;
        }

    }


    // Check the price existance in database
    private string CheckIfPriceExists(decimal amount)
    {
        string priceId;
        PriceAmount priceAmount = db.PriceAmounts.Where(p => p.priceAmount1 == amount).FirstOrDefault();
        if (priceAmount == null)
            priceId = null;
        else
            priceId = priceAmount.priceId;
        return priceId;
    }

    // Store new price in database 
    private void StorePriceInDatabase(decimal amount, string priceId)
    {
        try
        {
            PriceAmount priceAmount = new PriceAmount();
            priceAmount.priceAmount1 = amount;
            priceAmount.priceId = priceId;
            db.PriceAmounts.Add(priceAmount);
            db.SaveChanges();
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


    public ActionResult Donors()
    {
        var donors = db.Donors.OrderByDescending(d => d.donation_id).ToList();
        return View(donors);
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