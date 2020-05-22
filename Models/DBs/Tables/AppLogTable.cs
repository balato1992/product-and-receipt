using System;

namespace product_and_receipt.Models.DBs.Tables
{
    public class AppLogTable : SqlHelper
    {
        private static string TABLE => "APP_LOG";
        private static string FIELD_UID => "UID";
        private static string FIELD_TIME => "TIME";
        private static string FIELD_MSG => "MSG";

        public AppLogTable(string connectionString, LogFunc log = null) : base(connectionString, log)
        {
        }

        public void Insert(string msg)
        {
            DoExecuteNonQuery($"INSERT INTO {TABLE} ({FIELD_TIME}, {FIELD_MSG}) VALUES (?, ?) ", DateTime.Now, msg);
        }
        public void InsertException(string tag, Exception ex)
        {
            Insert($"Error: {tag}: {ex}");
        }
    }
}
