using product_and_receipt.Models.DBs.structures;
using System.Collections.Generic;
using System.Data.Odbc;

namespace product_and_receipt.Models.DBs.Tables
{
    public class CompanyTable : OdbcHelper
    {
        public static string TABLE => "COMPANY_INFO";
        public static string FIELD_UID => "UID";
        public static string FIELD_NAME => "NAME";
        public static string FIELD_ADDRESS => "ADDRESS";
        public static string FIELD_TELEPHONE => "TELEPHONE";
        public static string FIELD_FAX => "FAX";

        public CompanyTable(string dsn, string id, string password, LogFunc log = null) : base(dsn, id, password, log)
        {
        }

        public List<CompanyDatumWithUid> Get()
        {
            var list = new List<CompanyDatumWithUid>();
            DoReadAll($"SELECT * FROM {TABLE}", null,
                (OdbcDataReader reader) =>
                {
                    CompanyDatumWithUid item = ConvertTo(reader);
                    list.Add(item);
                });

            return list;
        }

        public CompanyDatumWithUid ConvertTo(OdbcDataReader reader, string prefix = null)
        {
            ConvertToInt(reader[prefix + FIELD_UID], out int uid);
            ConvertToString(reader[prefix + FIELD_NAME], out string name);
            ConvertToString(reader[prefix + FIELD_ADDRESS], out string address);
            ConvertToString(reader[prefix + FIELD_TELEPHONE], out string telephone);
            ConvertToString(reader[prefix + FIELD_FAX], out string fax);

            return new CompanyDatumWithUid(uid, name, address, telephone, fax);
        }

        public void Insert(CompanyDatum datum)
        {
            DoExecuteNonQuery($"INSERT INTO {TABLE} ({FIELD_NAME}, {FIELD_ADDRESS}, {FIELD_TELEPHONE}, {FIELD_FAX}) VALUES (?, ?, ?, ?)",
                (OdbcCommand cmd) =>
                {
                    AddParamsForObjs(cmd, datum.Name, datum.Address, datum.Telephone, datum.Fax);
                });
        }
        public void Update(CompanyDatumWithUid datum)
        {
            DoExecuteNonQuery($"UPDATE {TABLE} SET {FIELD_NAME}=?,{FIELD_ADDRESS}=?,{FIELD_TELEPHONE}=?,{FIELD_FAX}=? WHERE {FIELD_UID}=?",
                (OdbcCommand cmd) =>
                {
                    AddParamsForObjs(cmd, datum.Name, datum.Address, datum.Telephone, datum.Fax, datum.Uid);
                });
        }
    }
}
