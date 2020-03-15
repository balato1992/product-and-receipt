using System.Collections.Generic;

namespace product_and_receipt.Models.DBs.structures
{
    public class CompanySummaryData
    {
        public CompanyDatumWithUid Company { get; set; }
        public List<ProductDatum> ProductData { get; set; }

        public CompanySummaryData(CompanyDatumWithUid company, List<ProductDatum> productData)
        {
            Company = company;
            ProductData = productData;
        }
    }
}
