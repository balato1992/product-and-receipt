using System;

namespace product_and_receipt.Models.DBs.Structures
{
    public class ReceiptItemDatum
    {
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal Number { get; set; }

        public ReceiptItemDatum(string productName, decimal price, decimal number)
        {
            ProductName = productName;
            Price = price;
            Number = number;
        }
    }
}
