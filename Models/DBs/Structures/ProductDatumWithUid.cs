namespace product_and_receipt.Models.DBs.Structures
{
    public class MaterialDatumWithUid : MaterialDatum
    {
        public int Uid { get; set; }

        public MaterialDatumWithUid(int uid, string name, string spec1, string spec2, string type, string unit, decimal price, string image, int companyUid)
            : base(name, spec1, spec2, type, unit, price, image, companyUid)
        {
            Uid = uid;
        }
    }
}
