using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace product_and_receipt.Models.DBs.Structures
{
    public class MaterialDatum
    {
        public string Name { get; set; }
        public string Spec1 { get; set; }
        public string Spec2 { get; set; }
        public string Type { get; set; }
        public string Unit { get; set; }
        public decimal Price { get; set; }
        public string Image { get; set; }


        public int CompanyUid { get; set; }

        public MaterialDatum(string name, string spec1, string spec2, string type, string unit, 
            decimal price, string image, int companyUid)
        {
            Name = name;
            Spec1 = spec1;
            Spec2 = spec2;
            Type = type;
            Unit = unit;
            Price = price;
            Image = image;
            CompanyUid = companyUid;
        }
    }
}
