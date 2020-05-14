using System;

namespace product_and_receipt.Models.DBs.Structures
{
    public class ReceiptDatumWithUid : ReceiptDatum
    {
        public int Uid { get; set; }

        public ReceiptDatumWithUid(int uid, string id, string payee, DateTime date) : base(id, payee, date)
        {
            Uid = uid;
        }
    }
}
