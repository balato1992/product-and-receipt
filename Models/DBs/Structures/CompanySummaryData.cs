using System.Collections.Generic;

namespace product_and_receipt.Models.DBs.Structures
{
    public class CompanySummaryData
    {
        public CompanyDatumWithUid Company { get; set; }
        public List<MaterialDatumWithUid> MaterialData { get; set; }

        public CompanySummaryData(CompanyDatumWithUid company, List<MaterialDatumWithUid> materialData)
        {
            Company = company;
            MaterialData = materialData;
        }
    }
}
