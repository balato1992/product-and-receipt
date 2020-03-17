using product_and_receipt.Models.DBs.structures;
using product_and_receipt.Models.DBs.Tables;
using System.Collections.Generic;

namespace product_and_receipt.Models.DBs
{
    public class DBHelper : OdbcHelper
    {
        private CompanyTable _CompanyTable { get; set; }
        private MaterialTable _ProductTable { get; set; }
        private RecordTable _RecordTable { get; set; }

        public CompanyTable CompanyTable => _CompanyTable;
        public MaterialTable MaterialTable => _ProductTable;
        public RecordTable RecordTable => _RecordTable;

        public DBHelper(string dsn, string id, string password, LogFunc log = null) : base(dsn, id, password, log)
        {
            _CompanyTable = new CompanyTable(dsn, id, password, log);
            _ProductTable = new MaterialTable(dsn, id, password, log);
            _RecordTable = new RecordTable(dsn, id, password, log);
        }


        public List<CompanySummaryData> GetCompanySummaries()
        {
            List<CompanySummaryData> list = new List<CompanySummaryData>();

            var companies = _CompanyTable.Get();
            foreach (var company in companies)
            {
                var products = _ProductTable.Get(company.Uid);

                var item = new CompanySummaryData(company, products);

                list.Add(item);
            }

            return list;
        }
    }
}
