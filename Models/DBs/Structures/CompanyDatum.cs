﻿namespace product_and_receipt.Models.DBs.Structures
{
    public class CompanyDatum
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Telephone { get; set; }
        public string Fax { get; set; }
        public string Remark { get; set; }

        public CompanyDatum(string name, string address, string telephone, string fax, string remark)
        {
            Name = name;
            Address = address;
            Telephone = telephone;
            Fax = fax;
            Remark = remark;
        }
    }
}
