using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Odbc;

namespace product_and_receipt.Models
{
    public abstract class OdbcHelper
        {
            public delegate void LogFunc(Exception ex, string msgPrefix = null);

            private readonly string _ConnectionString;
            private readonly LogFunc _Log;

            protected OdbcHelper(string dsn, string id, string password, LogFunc log = null)
            {
                _ConnectionString = CreateOdbcConnectionString(dsn, id, password);

                _Log = log;
            }

            #region command
            protected void DoCommand(string sql, Action<OdbcCommand> preAction, Action<OdbcCommand> postAction)
            {
                DoCommand(_Log, _ConnectionString, sql, preAction, postAction);
            }
            protected void DoExecuteNonQuery(string sql, Action<OdbcCommand> preAction = null)
            {
                DoExecuteNonQuery(_Log, _ConnectionString, sql, preAction);
            }
            protected int DoReadAll(string sql, Action<OdbcCommand> preAction, Action<OdbcDataReader> actionReader)
            {
                return DoReadAll(_Log, _ConnectionString, sql, preAction, actionReader);
            }
            protected int DoReadAllSeparate<T>(string sql1, string sql2, uint maxCount, List<T> data, Action<OdbcDataReader> actionReader)
            {
                return DoReadAllSeparate(_Log, _ConnectionString, sql1, sql2, maxCount, data, actionReader);
            }
            #region static
            private static string CreateOdbcConnectionString(string dsn, string id, string password)
            {
                try
                {
                    OdbcConnectionStringBuilder builder = new OdbcConnectionStringBuilder
                {
                    { "Dsn", dsn },
                    { "Uid", id },
                    { "Pwd", password }
                };

                    return builder.ConnectionString;
                }
                catch (Exception ex)
                {
                    throw new Exception($"Create ConnectionString error: {dsn}, {id}, {password}", ex);
                }
            }

            private static void DoCommand(LogFunc log, string connectionString, string sql, Action<OdbcCommand> preAction, Action<OdbcCommand> postAction)
            {
                try
                {
                    using (var connection = new OdbcConnection(connectionString))
                    {
                        using (var cmd = new OdbcCommand(sql, connection))
                        {
                            connection.Open();
                            OdbcTransaction tran = connection.BeginTransaction();
                            cmd.Transaction = tran;
                            try
                            {
                                preAction?.Invoke(cmd);

                                postAction?.Invoke(cmd);

                                tran.Commit();
                            }
                            catch (Exception ex)
                            {
                                log?.Invoke(ex, $"@@ connectionString: '{connectionString}', sql: '{sql}' @@");
                                try
                                {
                                    tran.Rollback();
                                }
                                catch (Exception ex2)
                                {
                                    log?.Invoke(ex2);
                                    throw ex2;
                                }
                                throw ex;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    log?.Invoke(ex, $"@@ connectionString: '{connectionString}', sql: '{sql}' @@");

                    throw ex;
                }
            }

            private static void DoExecuteNonQuery(LogFunc log, string connectionString, string sql, Action<OdbcCommand> preAction = null)
            {
                DoCommand(log, connectionString, sql, preAction, (OdbcCommand cmd) =>
                {
                    cmd.ExecuteNonQuery();
                });
            }
            private static int DoReadAll(LogFunc log, string connectionString, string sql, Action<OdbcCommand> preAction, Action<OdbcDataReader> actionReader)
            {
                int count = 0;

                DoCommand(log, connectionString, sql, preAction, (OdbcCommand cmd) =>
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            count++;
                            actionReader?.Invoke(reader);
                        }
                    }
                });

                return count;
            }
            private static int DoReadAllSeparate<T>(LogFunc log, string connectionString, string sql1, string sql2, uint maxCount, List<T> data, Action<OdbcDataReader> actionReader)
            {
                int sumCount = 0;

                List<object> tmp = new List<object>();
                for (int i = 0; i < data.Count; i++)
                {
                    if (i % maxCount == 0)
                    {
                        tmp = new List<object>();
                    }

                    tmp.Add(data[i]);

                    if (i % maxCount == maxCount - 1 || i == (data.Count - 1))
                    {
                        sumCount += DoReadAll(log, connectionString, sql1 + string.Join(",", tmp.ConvertAll(o => "?").ToArray()) + sql2,
                            (OdbcCommand cmd) =>
                            {
                                AddParamsForObjs(cmd, tmp.ToArray());
                            }, actionReader);
                    }
                }

                return sumCount;
            }


            protected static void AddParamsForObjs(OdbcCommand cmd, params object[] values)
            {
                foreach (object value in values)
                {
                    if (value == null || _CheckNumberIsNotValid(value))
                    {
                        cmd.Parameters.AddWithValue("", DBNull.Value);
                    }
                    else if (value.GetType() == typeof(DateTime))
                    {
                        DateTime dtValue = (DateTime)value;

                        // reference: https://stackoverflow.com/questions/20695937/c-sharp-datetime-to-odbc-datetime-conversion-error/20696264#20696264
                        OdbcParameter param = new OdbcParameter("", OdbcType.DateTime, 23, ParameterDirection.Input, false, 0, 3, "", DataRowVersion.Current, dtValue);

                        cmd.Parameters.Add(param);
                    }
                    else if (value.GetType().IsEnum)
                    {
                        cmd.Parameters.AddWithValue("", value.ToString());
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("", value);
                    }
                }
            }
            private static bool _CheckNumberIsNotValid(object value)
            {
                if (value.GetType() == typeof(float))
                {
                    float f = (float)value;

                    return float.IsNaN(f) || float.IsInfinity(f);
                }
                else if (value.GetType() == typeof(double))
                {
                    double f = (double)value;

                    return double.IsNaN(f) || double.IsInfinity(f);
                }

                return false;
            }
            #endregion static
            #endregion command

            #region Convert
            private static bool TryConvertValue<T>(LogFunc log, object obj, out T outValue, T defaultValue = default(T))
            {
                try
                {
                    if (obj == DBNull.Value)
                    {
                        obj = null;
                    }

                    outValue = (T)Convert.ChangeType(obj, typeof(T));

                    return true;
                }
                catch (Exception ex)
                {
                    log?.Invoke(ex, $"@type: '{typeof(T)}', obj: '{obj}'@");
                    outValue = defaultValue;

                    return false;
                }
            }
            private static T? ConvertToNull<T>(LogFunc log, object obj) where T : struct
            {
                try
                {
                    if (obj == DBNull.Value)
                    {
                        obj = null;
                    }

                    if (obj == null)
                    {
                        return null;
                    }

                    return (T)Convert.ChangeType(obj, typeof(T));
                }
                catch (Exception ex)
                {
                    log?.Invoke(ex, $"@type: '{typeof(T)}', obj: '{obj}'@");

                    return null;
                }
            }

            private bool TryConvertValue<T>(object obj, out T outValue, T defaultValue = default(T))
            {
                return TryConvertValue(_Log, obj, out outValue, defaultValue);
            }
            public T? ConvertToNull<T>(object obj) where T : struct
            {
                return ConvertToNull<T>(_Log, obj);
            }
            public T ConvertTo<T>(object obj)
            {
                return (T)Convert.ChangeType(obj, typeof(T));
            }

            #region specific
            public bool ConvertToString(object obj, out string outValue, string defaultValue = null)
            {
                return TryConvertValue(obj, out outValue, defaultValue);
            }
            public bool ConvertToInt(object obj, out int outValue, int defaultValue = int.MinValue)
            {
                return TryConvertValue(obj, out outValue, defaultValue);
            }
            public bool ConvertToDouble(object obj, out double outValue, double defaultValue = double.NaN)
            {
                return TryConvertValue(obj, out outValue, defaultValue);
            }
            public bool ConvertToDecimal(object obj, out decimal outValue, decimal defaultValue = decimal.MinValue)
            {
                return TryConvertValue(obj, out outValue, defaultValue);
            }
            public bool ConvertToDateTime(object obj, out DateTime outValue, DateTime? defaultValue = null)
            {
                return TryConvertValue(obj, out outValue, defaultValue ?? DateTime.MinValue);
            }
            public bool ConvertToEnum<T>(object obj, out T outValue, T defaultValue = default(T)) where T : struct, IConvertible
            {
                TryConvertValue(obj, out string strValue);

                if (!typeof(T).IsEnum)
                {
                    throw new ArgumentException("Argument type must be an Enum.");
                }

                foreach (T value in Enum.GetValues(typeof(T)))
                {
                    if (strValue == value.ToString())
                    {
                        outValue = value;
                        return true;
                    }
                }

                outValue = defaultValue;
                return false;
            }
            #endregion specific

            #endregion Convert

            public static string Sql_MakeTableAlias(out string aliasPrefix, string tableName, List<string> names, string between = "@@")
            {
                string tmp = tableName + between;
                aliasPrefix = tmp;

                return string.Join(", ", names.ConvertAll(o => $"{tableName}.{o} AS {tmp}{o} ").ToArray());
            }
        }

}
