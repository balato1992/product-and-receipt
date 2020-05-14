using product_and_receipt.Models.DBs.Structures;
using product_and_receipt.Models.DBs.Tables;
using System.Collections.Generic;

namespace product_and_receipt.Models.DBs
{
    public class DBHelper : SqlHelper
    {
        private CompanyTable _CompanyTable { get; set; }
        private MaterialTable _MaterialTable { get; set; }
        private ReceiptTable _ReceiptTable { get; set; }
        private RecordTable _RecordTable { get; set; }

        public CompanyTable CompanyTable => _CompanyTable;
        public MaterialTable MaterialTable => _MaterialTable;
        public ReceiptTable ReceiptTable => _ReceiptTable;
        public RecordTable RecordTable => _RecordTable;

        public DBHelper(string connectionString, LogFunc log = null) : base(connectionString, log)
        {
            _CompanyTable = new CompanyTable(connectionString, log);
            _MaterialTable = new MaterialTable(connectionString, log);
            _ReceiptTable = new ReceiptTable(connectionString, log);
            _RecordTable = new RecordTable(connectionString, log);
        }


        public List<CompanySummaryData> GetCompanySummaries()
        {
            List<CompanySummaryData> list = new List<CompanySummaryData>();

            var companies = _CompanyTable.Get();
            foreach (var company in companies)
            {
                var products = _MaterialTable.Get(company.Uid);

                var item = new CompanySummaryData(company, products);

                list.Add(item);
            }

            return list;
        }
    }
}
