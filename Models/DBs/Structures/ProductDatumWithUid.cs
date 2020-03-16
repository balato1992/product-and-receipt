namespace product_and_receipt.Models.DBs.structures
{
    public class ProductDatumWithUid : ProductDatum
    {
        public int Uid { get; set; }

        public ProductDatumWithUid(int uid, string name, string spec1, string spec2, string type, string unit, decimal price, int companyUid)
            : base(name, spec1, spec2, type, unit, price, companyUid)
        {
            Uid = uid;
        }
    }
}
