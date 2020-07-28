﻿namespace product_and_receipt.Models.DBs.Structures
{
    public class CompanyDatumWithUid : CompanyDatum
    {
        public int Uid { get; set; }

        public CompanyDatumWithUid(int uid, string name, string address,
            string telephone, string fax, string remark)
            : base(name, address, telephone, fax, remark)
        {
            Uid = uid;
        }
    }
}
