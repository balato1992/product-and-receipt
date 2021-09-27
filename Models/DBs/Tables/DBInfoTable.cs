using System;
using System.Data.SqlClient;
using System.IO;

namespace product_and_receipt.Models.DBs.Tables
{
    public class DBInfoTable : SqlHelper
    {
        public static string TABLE => "DB_INFO";
        public static string FIELD_NAME => "NAME";
        public static string FIELD_VALUE => "VALUE";


        public static string NAME_VERSION => "VERSION";
        public static string NAME_BACKUP_PERIOD_HOURS => "BACKUP_PERIOD_HOURS";
        public static string NAME_BACKUP_DATE => "BACKUP_DATE";

        public DBInfoTable(string connectionString, LogFunc log = null) : base(connectionString, log)
        {
        }

        public DBVersion GetVersion()
        {
            string sql = $"IF (EXISTS "
                + $" (SELECT * FROM INFORMATION_SCHEMA.TABLES "
                + $" WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = '{TABLE}')) "
                + $" BEGIN "
                + $" SELECT * FROM {TABLE} WHERE {FIELD_NAME}='{NAME_VERSION}' "
                + $" END ";

            DBVersion version = DBVersion.v1;
            DoReadAll(sql,
                (SqlDataReader reader) =>
                {
                    ConvertToEnum(reader[FIELD_VALUE], out version);
                });

            return version;
        }


        /*
            BACKUP DATABASE [DBNAME] 
            TO DISK = N'PATH' WITH NOFORMAT, 
            NOINIT, NAME = N'Chad Database Backup', SKIP,NOREWIND, NOUNLOAD, STATS = 10

            RESTORE VERIFYONLY FROM  DISK = N'PATH' WITH FILE= 1, NOUNLOAD, NOREWIND

            RESTORE DATABASE [DBNAME] FROM  DISK = N'PATH' WITH FILE = 1, NOUNLOAD, STATS = 10
             */
        public bool CheckIfNeedBackup()
        {
            string sql = $"SELECT * FROM {TABLE} WHERE {FIELD_NAME}='{NAME_BACKUP_PERIOD_HOURS}'";

            int period = 24 * 3;
            DoReadAll(sql,
                (SqlDataReader reader) =>
                {
                    ConvertToInt(reader[FIELD_VALUE], out period);
                });


            sql = $"SELECT * FROM {TABLE} WHERE {FIELD_NAME}='{NAME_BACKUP_DATE}'";

            DateTime last = DateTime.MinValue;
            DoReadAll(sql,
                (SqlDataReader reader) =>
                {
                    object value = reader[FIELD_VALUE];
                    ConvertToDateTime(value, out last);
                });

            return last.AddHours(period) < DateTime.Now;
        }
        public void Backup(string root)
        {
            string time = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss");
            string sql = $"IF (EXISTS "
                + $" (SELECT * FROM {TABLE} WHERE {FIELD_NAME}='{NAME_BACKUP_DATE}')) "
                + $" BEGIN "
                + $" UPDATE {TABLE} SET {FIELD_VALUE}='{time}' WHERE {FIELD_NAME}='{NAME_BACKUP_DATE}'"
                + $" END "
                + $" ELSE "
                + $" BEGIN "
                + $" INSERT INTO {TABLE} ({FIELD_NAME}, {FIELD_VALUE}) VALUES ('{NAME_BACKUP_DATE}', '{time}') "
                + $" END ";
            DoExecuteNonQuery(sql);

            using var connection = new SqlConnection(ConnectionString);

            string dbName = connection.Database;
            string rootPath = $"{root}\\backup";
            string fileName = $"{rootPath}\\Backup_{DateTime.Now:yyyyMMdd_HHmmss}.bak";

            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }

            string sql2 = $" BACKUP DATABASE [{dbName}]  "
                + $" TO DISK = N'{fileName}' WITH NOFORMAT, "
                + $" NOINIT, NAME = N'Database Backup({dbName} )', SKIP, NOREWIND, NOUNLOAD, STATS = 10 ";

            DoExecuteNonQuery_NoTrans(sql2);
        }
    }

    public enum DBVersion { v1, v2, v3 }
}
