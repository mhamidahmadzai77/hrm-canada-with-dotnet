using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HRM.Models
{
    public class PaymentSuccessViewModel
    {
        public string TransactionId { get; set; }
        public decimal AmountPaid { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PayerEmail { get; set; }
    }
}