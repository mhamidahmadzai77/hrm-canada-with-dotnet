using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HRM.Models
{
    public class PaymentDataModel
    {
        public string PaymentMethodData { get; set; } // JSON string containing payment method details
        public string TransactionId { get; set; }      // ID for the transaction (if applicable)
        public decimal TotalPrice { get; set; }        // Total amount for the transaction
        public string CurrencyCode { get; set; }       // Currency code (e.g., "USD")
        public DateTime PaymentDate { get; set; }      // Date of payment
        public string MerchantId { get; set; }          // Your merchant ID

        // You can add additional properties as needed
    }
}
