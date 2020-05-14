using System.Collections.Generic;

namespace product_and_receipt.Models.DBs.Structures
{
    public class CompanySummaryData
    {
        public CompanyDatumWithUid Company { get; set; }
        public List<MaterialDatumWithUid> ProductData { get; set; }

        public CompanySummaryData(CompanyDatumWithUid company, List<MaterialDatumWithUid> productData)
        {
            Company = company;
            ProductData = productData;
        }
    }
}
