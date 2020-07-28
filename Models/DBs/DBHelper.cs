﻿using product_and_receipt.Models.DBs.Structures;
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


            if (version == DBVersion.v1)
            {
                string sql = $" CREATE TABLE {DBInfoTable.TABLE} ( "
                    + $" {DBInfoTable.FIELD_DATA} varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS NULL "
                    + $" ); "
                    + $" INSERT INTO {DBInfoTable.TABLE} ({DBInfoTable.FIELD_DATA}) VALUES (?); "
                    + $" ALTER TABLE {CompanyTable.TABLE} "
                    + $" ADD {CompanyTable.FIELD_REMARK} varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS NULL; ";

                DoExecuteNonQuery(sql, DBVersion.v2);

                return DBVersion.v2.ToString();
            }
            else
            {
                return DBVersion.v1.ToString();
            }
        }

    }
}
