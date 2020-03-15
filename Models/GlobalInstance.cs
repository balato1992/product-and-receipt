using product_and_receipt.Models.DBs;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace product_and_receipt.Models
{
    public class GlobalInstance
    {
        internal static LogHelper Log { get; private set; }
        internal static DBHelper DB { get; private set; }

        internal static InitializingStatus Status { get; set; } = InitializingStatus.Initializing;
        internal static bool InitializeInNewThread()
        {
            Log = new LogHelper(GetAppDataPath());
            Log.WriteLine("Log Initialized");

            Status = InitializingStatus.Initializing;
            try
            {

                string configPath = GetPath("db.config");
                List<string> configLines = File.ReadLines(configPath).ToList();

                Log.WriteLine("Config Initialized");

                try
                {
                    DB = new DBHelper(configLines[0], configLines[1], configLines[2], (Exception ex, string msgPrefix) =>
                    {
                        Log.WriteLineException(msgPrefix, ex);
                    });
                    Log.WriteLine("DBHelper Initialized");
                }
                catch (Exception ex)
                {
                    Log.WriteLineException("Initialize DB", ex);
                    Status = InitializingStatus.DBFailed;
                    return false;
                }

                Status = InitializingStatus.Done;
                return true;
            }
            catch (Exception ex)
            {
                Log.WriteLineException("Initialize", ex);
                Status = InitializingStatus.Failed;
                return false;
            }
        }


        internal static string GetAppDataPath()
        {
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data");
        }
        internal static string GetPath(string fileName)
        {
            return Path.Combine(GetAppDataPath(), fileName);
        }
    }
    public enum InitializingStatus { Initializing, Done, Failed, DBFailed }
}
