using System.Data.Odbc;

namespace product_and_receipt.Models.DBs.Tables
{
    public class RecordTable : OdbcHelper
    {
        private static string TABLE => "RECORD";
        //private static string FIELD_UID => "UID";
        //private static string FIELD_INSERT_TIME => "INSERT_TIME";
        private static string FIELD_TAG => "TAG";
        private static string FIELD_JSON_DATA => "JSON_DATA";

        public RecordTable(string dsn, string id, string password, LogFunc log = null) : base(dsn, id, password, log)
        {
        }

        public void Insert(string tag, object data)
        {
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(data);

            DoExecuteNonQuery($"INSERT INTO {TABLE} ({FIELD_TAG},{FIELD_JSON_DATA}) "
                + $" VALUES (?, ?)",
                (OdbcCommand cmd) =>
                {
                    AddParamsForObjs(cmd, tag, json);
                });
        }
    }
}
