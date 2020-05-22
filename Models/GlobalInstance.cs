using product_and_receipt.Models.DBs;
using System;

namespace product_and_receipt.Models
{
    public class GlobalInstance
    {
        internal static DBHelper DB { get; private set; }

        internal static void Initialize(string connectionString)
        {
            try
            {
                DB = new DBHelper(connectionString, (Exception ex, string msgPrefix) =>
                {
                    DB.AppLogTable.InsertException(msgPrefix, ex);
                });
                DB.AppLogTable.Insert("DBHelper Initialized");
            }
            catch (Exception ex)
            {
                DB.AppLogTable.InsertException("Initialize DB", ex);
            }
        }
    }
}
