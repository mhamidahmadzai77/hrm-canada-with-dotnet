using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HRM.Models
{
    public class ContactViewModel
    {
        public int contact_id { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string email { get; set; }
        public string country { get; set; }
        public string subject { get; set; }
        public string message { get; set; }
        public string read { get; set; }
        public System.DateTime time { get; set; }
        public string difference_time { get; set; } // This will hold the time difference string  
    }
}