using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HRM.Models;
using Newtonsoft.Json;

namespace HRM.Controllers
{
    public class BasketController : Controller
    {
        private const string BasketCookieKey = "BasketCookie";

        [HttpPost]
        public JsonResult AddToBasket(int id, string name, decimal amount)
        {
            var basketOldItems = GetBasket();
            var existingItem = basketOldItems.FirstOrDefault(i => i.Name.Equals(name, StringComparison.OrdinalIgnoreCase));

            var item = "";
            if (existingItem != null)
            {
                item = existingItem.Name;
                existingItem.Amount += amount;
            }
            else
            {
                item = "New Item";
                basketOldItems.Add(new DonationItem { Id = id, Name = name, Amount = amount });
            }

            SaveBasket(basketOldItems);

            #region 
            // Get updated basket data
            var basketNewItems = GetBasket();
            ViewBag.basket = basketNewItems;
            var count = basketNewItems.Count;

            return Json(new { count = count, item = item, items = basketOldItems }, JsonRequestBehavior.AllowGet);
            #endregion
        }

        [HttpPost]
        public JsonResult ClearBasket(int amount, string name = null)
        {
            var basket = GetBasket();

            if (!string.IsNullOrEmpty(name))
            {
                // Remove the item with the specified name  
                var itemToRemove = basket.FirstOrDefault(i => i.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
                if (itemToRemove != null)
                {
                    basket.Remove(itemToRemove);
                    SaveBasket(basket);
                    return Json("deleted", JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                // If no name is provided, clear the entire basket  
                Response.Cookies.Remove(BasketCookieKey);
                return Json("", JsonRequestBehavior.AllowGet);
            }

            SaveBasket(basket);
            return Json("", JsonRequestBehavior.AllowGet);
        }

        // Should remove the function because it was for testing 
        public void clear()
        {
            Response.Cookies[BasketCookieKey].Expires = DateTime.Now.AddDays(-1); // Expire the cookie  

        }
        public List<DonationItem> GetBasket()
        {
            var cookie = Request.Cookies[BasketCookieKey];

            if (cookie != null)
            {
                return JsonConvert.DeserializeObject<List<DonationItem>>(cookie.Value);
            }

            return new List<DonationItem>();
        }

        private void SaveBasket(List<DonationItem> basket)
        {
            var cookie = new HttpCookie(BasketCookieKey, JsonConvert.SerializeObject(basket))
            {
                Expires = DateTime.Now.AddDays(30) // Set cookie expiration as needed  
            };

            Response.Cookies.Add(cookie);
        }

       
    }
}