using product_and_receipt.Models.DBs.structures;
using System.Collections.Generic;
using System.Data.Odbc;

namespace product_and_receipt.Models.DBs.Tables
{
    public class CompanyTable : OdbcHelper
    {
        private static string TABLE => "COMPANY_INFO";
        private static string FIELD_UID => "UID";
        private static string FIELD_NAME => "NAME";
        private static string FIELD_ADDRESS => "ADDRESS";
        private static string FIELD_TELEPHONE => "TELEPHONE";
        private static string FIELD_FAX => "FAX";
        private static List<string> SEARCH_FIELDS => new List<string>()
        {
            FIELD_NAME,
            FIELD_ADDRESS,
            FIELD_TELEPHONE,
            FIELD_FAX
        };

        public CompanyTable(string dsn, string id, string password, LogFunc log = null) : base(dsn, id, password, log)
        {
        }

        public List<CompanyDatumWithUid> Get()
        {
            string sql = $"SELECT * FROM {TABLE}";

            var list = new List<CompanyDatumWithUid>();
            DoReadAll(sql, null,
                (OdbcDataReader reader) =>
                {
                    CompanyDatumWithUid item = ConvertTo(reader);
                    list.Add(item);
                });

            return list;
        }
        public List<CompanyDatumWithUid> GetForApi(int pageSize, ref int pageIndex, string searchText, out int totalCount)
        {
            if (pageSize < 5)
            {
                pageSize = 5;
            }

            int rowsOffset = pageIndex * pageSize;

            int tmpCount = 0;
            DoReadAll($"SELECT COUNT(*) AS CUS_COUNT FROM {TABLE}", null,
                (OdbcDataReader reader) =>
                {
                    ConvertToInt(reader["CUS_COUNT"], out tmpCount);
                });
            totalCount = tmpCount;

            string sql =
                $"SELECT * FROM {TABLE} "
                + $" WHERE {string.Join(" OR ", SEARCH_FIELDS.ConvertAll(o => $"{o} LIKE ?"))} "
                + $" ORDER BY {FIELD_NAME} OFFSET {rowsOffset} ROWS "
                + $" FETCH NEXT {pageSize} ROWS ONLY ";

            var list = new List<CompanyDatumWithUid>();
            DoReadAll(sql,
                (OdbcCommand cmd) =>
                {
                    AddParamsForObjs(cmd, SEARCH_FIELDS.ConvertAll(o => $"%{searchText}%").ToArray());
                },
                (OdbcDataReader reader) =>
                {
                    CompanyDatumWithUid item = ConvertTo(reader);
                    list.Add(item);
                });

            return list;
        }

        private CompanyDatumWithUid ConvertTo(OdbcDataReader reader, string prefix = null)
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
        public void Delete(int uid)
        {
            DoExecuteNonQuery($"DELETE FROM {TABLE} WHERE {FIELD_UID}=?",
                (OdbcCommand cmd) =>
                {
                    AddParamsForObjs(cmd, uid);
                });
        }
    }
}
