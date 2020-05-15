namespace product_and_receipt.Models.DBs.Structures
{
    public class ReceiptItemDatum
    {
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal ProductNumber { get; set; }

        public ReceiptItemDatum(string productName, decimal price, decimal productNumber)
        {
            ProductName = productName;
            Price = price;
            ProductNumber = productNumber;
        }
    }
}
