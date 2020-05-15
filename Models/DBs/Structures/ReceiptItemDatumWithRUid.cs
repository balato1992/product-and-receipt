using System;

namespace product_and_receipt.Models.DBs.Structures
{
    public class ReceiptItemDatumWithRUid : ReceiptItemDatum
    {
        public int ReceiptUid { get; set; }

        public ReceiptItemDatumWithRUid(int receiptUid, string productName, decimal price, decimal productNumber) : base(productName, price, productNumber)
        {
            ReceiptUid = receiptUid;
        }
    }
}
