namespace product_and_receipt.Models.DBs.structures
{
    public class ProductDatum
    {
        public string Name { get; set; }
        public string Spec1 { get; set; }
        public string Spec2 { get; set; }
        public string Type { get; set; }
        public string Unit { get; set; }
        public decimal Price { get; set; }

        public int CompanyUid { get; set; }

        public ProductDatum(string name, string spec1, string spec2, string type, string unit, decimal price, int companyUid)
        {
            Name = name;
            Spec1 = spec1;
            Spec2 = spec2;
            Type = type;
            Unit = unit;
            Price = price;
            CompanyUid = companyUid;
        }
    }
}
