using System.Data.Odbc;
using System.Data.SqlClient;

namespace product_and_receipt.Models.DBs.Tables
{
    public class RecordTable : SqlHelper
    {
        private static string TABLE => "RECORD";
        //private static string FIELD_UID => "UID";
        //private static string FIELD_INSERT_TIME => "INSERT_TIME";
        private static string FIELD_TAG => "TAG";
        private static string FIELD_JSON_DATA => "JSON_DATA";

        public RecordTable(string connectionString, LogFunc log = null) : base(connectionString, log)
        {
        }

        public void Insert(string tag, object data)
        {
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(data);

            DoExecuteNonQuery($"INSERT INTO {TABLE} ({FIELD_TAG},{FIELD_JSON_DATA}) VALUES (?, ?)",
                tag, json);
        }
    }
}
