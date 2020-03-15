using product_and_receipt.Models.DBs.structures;
using System.Collections.Generic;
using System.Data.Odbc;

namespace product_and_receipt.Models.DBs.Tables
{
    public class ProductTable : OdbcHelper
    {
        public static string TABLE => "PRODUCT_INFO";
        public static string FIELD_UID => "UID";
        public static string FIELD_NAME => "NAME";
        public static string FIELD_SPEC1 => "SPEC1";
        public static string FIELD_SPEC2 => "SPEC2";
        public static string FIELD_TYPE => "TYPE";
        public static string FIELD_UNIT => "UNIT";
        public static string FIELD_PRICE => "PRICE";
        public static string FIELD_COMPANY_UID => "COMPANY_UID";

        public ProductTable(string dsn, string id, string password, LogFunc log = null) : base(dsn, id, password, log)
        {
        }

        public List<ProductDatum> Get()
        {
            var list = new List<ProductDatum>();
            DoReadAll($"SELECT * FROM {TABLE}", null,
                (OdbcDataReader reader) =>
                {
                    ProductDatum item = ConvertTo(reader);
                    list.Add(item);
                });

            return list;
        }
        public List<ProductDatum> Get(int companyUid)
        {
            var list = new List<ProductDatum>();
            DoReadAll($"SELECT * FROM {TABLE} WHERE {FIELD_COMPANY_UID}=?",
                (OdbcCommand cmd) =>
                {
                    AddParamsForObjs(cmd, companyUid);
                },
                (OdbcDataReader reader) =>
                {
                    ProductDatum item = ConvertTo(reader);
                    list.Add(item);
                });

            return list;
        }

        public ProductDatum ConvertTo(OdbcDataReader reader, string prefix = null)
        {
            ConvertToInt(reader[prefix + FIELD_UID], out int uid);
            ConvertToString(reader[prefix + FIELD_NAME], out string name);
            ConvertToString(reader[prefix + FIELD_SPEC1], out string spec1);
            ConvertToString(reader[prefix + FIELD_SPEC2], out string spec2);
            ConvertToString(reader[prefix + FIELD_TYPE], out string type);
            ConvertToString(reader[prefix + FIELD_UNIT], out string unit);
            ConvertToDecimal(reader[prefix + FIELD_PRICE], out decimal price);

            return new ProductDatum(uid, name, spec1, spec2, type, unit, price);
        }
    }
}
