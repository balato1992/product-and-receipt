using product_and_receipt.Models.DBs;
using System;

namespace product_and_receipt.Models
{
    public class GlobalInstance
    {
        internal static DBHelper DB { get; private set; }

        internal static InitializingStatus Status { get; set; } = InitializingStatus.Initializing;
        internal static bool InitializeInNewThread(string connectionString)
        {
            Status = InitializingStatus.Initializing;
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
                Status = InitializingStatus.DBFailed;
                return false;
            }

            Status = InitializingStatus.Done;
            return true;
        }
    }
    public enum InitializingStatus { Initializing, Done, Failed, DBFailed }
}
