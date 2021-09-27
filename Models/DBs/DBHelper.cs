using product_and_receipt.Models.DBs.Structures;
using product_and_receipt.Models.DBs.Tables;
using System.Collections.Generic;

namespace product_and_receipt.Models.DBs
{
    public class DBHelper : SqlHelper
    {
        private AppLogTable _AppLogTable { get; set; }
        private CompanyTable _CompanyTable { get; set; }
        private DBInfoTable _DBInfoTable { get; set; }
        private MaterialTable _MaterialTable { get; set; }
        private ReceiptTable _ReceiptTable { get; set; }
        private RecordTable _RecordTable { get; set; }

        public AppLogTable AppLogTable => _AppLogTable;
        public CompanyTable CompanyTable => _CompanyTable;
        public DBInfoTable DBInfoTable => _DBInfoTable;
        public MaterialTable MaterialTable => _MaterialTable;
        public ReceiptTable ReceiptTable => _ReceiptTable;
        public RecordTable RecordTable => _RecordTable;

        public DBHelper(string connectionString, LogFunc log = null) : base(connectionString, log)
        {
            _AppLogTable = new AppLogTable(connectionString, log);
            _CompanyTable = new CompanyTable(connectionString, log);
            _DBInfoTable = new DBInfoTable(connectionString, log);
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


        public string UpdateDBVersion()
        {
            DBVersion version = DBInfoTable.GetVersion();

            switch (version)
            {
                case DBVersion.v1:
                    string sql = $" CREATE TABLE {DBInfoTable.TABLE} ( "
                        + $" {DBInfoTable.FIELD_NAME} varchar(100) COLLATE Chinese_Taiwan_Stroke_CI_AS NOT NULL, "
                        + $" {DBInfoTable.FIELD_VALUE} varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS NULL, "
                        + $" CONSTRAINT DB_INFO_PK PRIMARY KEY({DBInfoTable.FIELD_NAME}) "
                        + $" ); "
                        + $" INSERT INTO {DBInfoTable.TABLE} ({DBInfoTable.FIELD_NAME}, {DBInfoTable.FIELD_VALUE}) VALUES ('VERSION', ?); "
                        + $" ALTER TABLE {CompanyTable.TABLE} "
                        + $" ADD {CompanyTable.FIELD_REMARK} varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS NULL; "

                        + $" EXEC sp_RENAME 'RECEIPT_INFO.DATE' , 'DATE_2', 'COLUMN'; "
                        + $" ALTER TABLE RECEIPT_INFO ADD RECEIPT_DATE varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS NULL; "
                        + $" EXEC('UPDATE RECEIPT_INFO SET RECEIPT_DATE = convert(varchar, DATE_2, 111)'); "
                        + $" ALTER TABLE RECEIPT_INFO DROP COLUMN DATE_2; ";

                    DoExecuteNonQuery(sql, DBVersion.v2);

                    return DBVersion.v2.ToString();
                case DBVersion.v2:
                    string sql2 = $"ALTER TABLE PRODUCT_INFO ADD PIC_IMAGE varchar(MAX) NULL;"
                    + $"UPDATE [dbo].[DB_INFO] SET VALUE=? WHERE NAME='VERSION'";

                    DoExecuteNonQuery(sql2, DBVersion.v3);

                    return DBVersion.v3.ToString();
                default:
                    return DBVersion.v1.ToString();
            }
        }

    }
}
