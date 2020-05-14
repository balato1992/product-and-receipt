using product_and_receipt.Models.DBs.Structures;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace product_and_receipt.Models.DBs.Tables
{
    public class ReceiptTable : SqlHelper
    {
        private static string TABLE => "RECEIPT_INFO";
        private static string FIELD_UID => "UID";
        private static string FIELD_ID => "ID";
        private static string FIELD_PAYEE => "PAYEE";
        private static string FIELD_DATE => "DATE";

        private static string ITEMS_TABLE => "RECEIPT_ITEM_INFO";
        private static string ITEMS_FIELD_UID => "UID";
        private static string ITEMS_FIELD_RECEIPT_UID => "RECEIPT_UID";
        private static string ITEMS_FIELD_PRODUCT_NAME => "PRODUCT_NAME";
        private static string ITEMS_FIELD_PRICE => "PRICE";
        private static string ITEMS_FIELD_NUMBER => "NUMBER";

        public ReceiptTable(string connectionString, LogFunc log = null) : base(connectionString, log)
        {
        }

        public List<ReceiptDatumWithUid> Get()
        {
            string sql = $"SELECT * FROM {TABLE}; SELECT * FROM {ITEMS_TABLE};";

            Dictionary<int, ReceiptDatumWithUid> tmpDict = new Dictionary<int, ReceiptDatumWithUid>();
            DoCommand(sql, (SqlCommand cmd) =>
            {
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    ReceiptDatumWithUid receipt = ConvertTo(reader);

                    tmpDict.Add(receipt.Uid, receipt);
                }

                reader.NextResult();

                while (reader.Read())
                {
                    ReceiptItemDatumWithRUid item = ConvertToItem(reader);

                    tmpDict[item.ReceiptUid].AddItem(item);
                }
            });

            return tmpDict.Values.ToList();
        }

        private ReceiptDatumWithUid ConvertTo(SqlDataReader reader, string prefix = null)
        {
            ConvertToInt(reader[prefix + FIELD_UID], out int uid);
            ConvertToString(reader[prefix + FIELD_ID], out string id);
            ConvertToString(reader[prefix + FIELD_PAYEE], out string payee);
            ConvertToDateTime(reader[prefix + FIELD_DATE], out DateTime date);

            return new ReceiptDatumWithUid(uid, id, payee, date);
        }
        private ReceiptItemDatumWithRUid ConvertToItem(SqlDataReader reader, string prefix = null)
        {
            ConvertToInt(reader[prefix + ITEMS_FIELD_RECEIPT_UID], out int rUid);
            ConvertToString(reader[prefix + ITEMS_FIELD_PRODUCT_NAME], out string name);
            ConvertToDecimal(reader[prefix + ITEMS_FIELD_PRICE], out decimal price);
            ConvertToDecimal(reader[prefix + ITEMS_FIELD_NUMBER], out decimal number);

            return new ReceiptItemDatumWithRUid(rUid, name, price, number);
        }


        public int Insert(ReceiptDatum datum)
        {
            List<object> parameter = new List<object>() { datum.Id, datum.Payee, datum.Date };
            const string tempTable = "@TEMP_OUTPUT";
            const string tempField = "TMP_UID";

            string sql =
                $" DECLARE {tempTable} TABLE ({tempField} int); "
                + $" INSERT INTO {TABLE} ({FIELD_ID}, {FIELD_PAYEE}, {FIELD_DATE})"
                + $" OUTPUT INSERTED.{FIELD_UID} INTO {tempTable}({tempField})"
                + $" VALUES (?, ?, ?); ";

            foreach (var item in datum.Items)
            {
                sql += $" INSERT INTO {ITEMS_TABLE} ({ITEMS_FIELD_RECEIPT_UID}, {ITEMS_FIELD_PRODUCT_NAME}, {ITEMS_FIELD_PRICE}, {ITEMS_FIELD_NUMBER}) "
                    + $" SELECT {tempField}, ?, ?, ? "
                    + $" FROM {tempTable}; ";
                parameter.Add(item.ProductName);
                parameter.Add(item.Price);
                parameter.Add(item.Number);
            }

            sql += $" SELECT * FROM {tempTable}; ";

            int receiptUid = -1;
            DoCommand(sql, (SqlCommand cmd) =>
            {
                //cmd.ExecuteNonQuery();
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    ConvertToInt(reader[tempField], out receiptUid);
                }
            }, parameter.ToArray());

            return receiptUid;
        }

        public void Update(ReceiptDatumWithUid datum)
        {
            string sql =
                $"UPDATE {TABLE} SET {FIELD_ID}=?,{FIELD_PAYEE}=?,{FIELD_DATE}=? WHERE {FIELD_UID}=?; "
                + $"DELETE FROM {ITEMS_TABLE} WHERE {ITEMS_FIELD_RECEIPT_UID}=?; ";
            List<object> parameter = new List<object>() { datum.Id, datum.Payee, datum.Date, datum.Uid, datum.Uid };

            foreach (var item in datum.Items)
            {
                sql += $" INSERT INTO {ITEMS_TABLE} ({ITEMS_FIELD_RECEIPT_UID}, {ITEMS_FIELD_PRODUCT_NAME}, {ITEMS_FIELD_PRICE}, {ITEMS_FIELD_NUMBER}) "
                    + $" VALUES (?, ?, ?, ?); ";
                parameter.Add(datum.Uid);
                parameter.Add(item.ProductName);
                parameter.Add(item.Price);
                parameter.Add(item.Number);
            }

            DoExecuteNonQuery(sql, parameter.ToArray());
        }
        public void Delete(int receiptUid)
        {
            string sql =
                $" DELETE FROM {ITEMS_TABLE} WHERE {ITEMS_FIELD_RECEIPT_UID}=?; "
                + $" DELETE FROM {TABLE} WHERE {FIELD_UID}=?; ";

            DoExecuteNonQuery(sql, receiptUid, receiptUid);
        }
    }
}
