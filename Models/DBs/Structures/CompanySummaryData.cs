using System.Collections.Generic;

namespace product_and_receipt.Models.DBs.structures
{
    public class CompanySummaryData
    {
        public CompanyDatumWithUid Company { get; set; }
        public List<ProductDatumWithUid> ProductData { get; set; }

        public CompanySummaryData(CompanyDatumWithUid company, List<ProductDatumWithUid> productData)
        {
            Company = company;
            ProductData = productData;
        }
    }
}
