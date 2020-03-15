namespace product_and_receipt.Models.DBs.structures
{
    public class CompanyDatum
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Telephone { get; set; }
        public string Fax { get; set; }

        public CompanyDatum(string name, string address, string telephone, string fax)
        {
            Name = name;
            Address = address;
            Telephone = telephone;
            Fax = fax;
        }
    }
}
