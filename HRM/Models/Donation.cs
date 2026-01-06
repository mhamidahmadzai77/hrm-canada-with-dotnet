
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HRM.Models
{
    public class Donation
    {
        public string DonationType { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public decimal Amount { get; set; }
    }
}