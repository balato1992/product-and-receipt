﻿using product_and_receipt.Models.DBs.Structures;
using System.Collections.Generic;
using System.Data.Odbc;
using System.Data.SqlClient;

namespace product_and_receipt.Models.DBs.Tables
{
    public class MaterialTable : SqlHelper
    {
        private static string TABLE => "PRODUCT_INFO";
        private static string FIELD_UID => "UID";
        private static string FIELD_NAME => "NAME";
        private static string FIELD_SPEC1 => "SPEC1";
        private static string FIELD_SPEC2 => "SPEC2";
        private static string FIELD_TYPE => "TYPE";
        private static string FIELD_UNIT => "UNIT";
        private static string FIELD_PRICE => "PRICE";
        private static string FIELD_PIC_IMAGE => "PIC_IMAGE";
        private static string FIELD_COMPANY_UID => "COMPANY_UID";
        private static List<string> SEARCH_FIELDS => new List<string>()
        {
            FIELD_NAME,
            FIELD_SPEC1,
            FIELD_SPEC2,
            FIELD_TYPE,
            FIELD_UNIT,
            FIELD_PRICE,
            FIELD_PIC_IMAGE
        };

        public MaterialTable(string connectionString, LogFunc log = null) : base(connectionString, log)
        {
        }

        public List<MaterialDatumWithUid> Get()
        {
            var list = new List<MaterialDatumWithUid>();
            DoReadAll($"SELECT * FROM {TABLE}",
                (SqlDataReader reader) =>
                {
                    MaterialDatumWithUid item = ConvertTo(reader);
                    list.Add(item);
                });

            return list;
        }
        public List<MaterialDatumWithUid> Get(int companyUid)
        {
            var list = new List<MaterialDatumWithUid>();
            DoReadAll($"SELECT * FROM {TABLE} WHERE {FIELD_COMPANY_UID}=?",
                (SqlDataReader reader) =>
                {
                    MaterialDatumWithUid item = ConvertTo(reader);
                    list.Add(item);
                }, companyUid);

            return list;
        }
        public List<MaterialDatumWithUid> GetForApi(int pageSize, ref int pageIndex, string searchText, out int totalCount)
        {
            if (pageSize < 5)
            {
                pageSize = 5;
            }

            int rowsOffset = pageIndex * pageSize;

            int tmpCount = 0;
            DoReadAll($"SELECT COUNT(*) AS CUS_COUNT FROM {TABLE}",
                (SqlDataReader reader) =>
                {
                    ConvertToInt(reader["CUS_COUNT"], out tmpCount);
                });
            totalCount = tmpCount;

            // TODO: implement company name searching
            string sql =
                $"SELECT * FROM {TABLE} "
                + $" WHERE {string.Join(" OR ", SEARCH_FIELDS.ConvertAll(o => $"{o} LIKE ?"))} "
                + $" ORDER BY {FIELD_NAME} OFFSET {rowsOffset} ROWS "
                + $" FETCH NEXT {pageSize} ROWS ONLY ";

            var list = new List<MaterialDatumWithUid>();
            DoReadAll(sql,
                (SqlDataReader reader) =>
                {
                    MaterialDatumWithUid item = ConvertTo(reader);
                    list.Add(item);
                }, SEARCH_FIELDS.ConvertAll(o => $"%{searchText}%").ToArray());

            return list;
        }

        private MaterialDatumWithUid ConvertTo(SqlDataReader reader, string prefix = null)
        {
            ConvertToInt(reader[prefix + FIELD_UID], out int uid);
            ConvertToString(reader[prefix + FIELD_NAME], out string name);
            ConvertToString(reader[prefix + FIELD_SPEC1], out string spec1);
            ConvertToString(reader[prefix + FIELD_SPEC2], out string spec2);
            ConvertToString(reader[prefix + FIELD_TYPE], out string type);
            ConvertToString(reader[prefix + FIELD_UNIT], out string unit);
            ConvertToDecimal(reader[prefix + FIELD_PRICE], out decimal price);
            ConvertToString(reader[prefix + FIELD_PIC_IMAGE], out string image);
            ConvertToInt(reader[prefix + FIELD_COMPANY_UID], out int companyUid);

            return new MaterialDatumWithUid(uid, name, spec1, spec2, type, unit, price, image, companyUid);
        }

        public void Insert(MaterialDatum datum)
        {
            DoExecuteNonQuery($"INSERT INTO {TABLE} ({FIELD_NAME}, {FIELD_SPEC1}, {FIELD_SPEC2}, {FIELD_TYPE}, {FIELD_UNIT}, {FIELD_PRICE}, {FIELD_PIC_IMAGE}, {FIELD_COMPANY_UID}) "
                + $" VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                datum.Name, datum.Spec1, datum.Spec2, datum.Type, datum.Unit, datum.Price, datum.Image, datum.CompanyUid);
        }
        public void Update(MaterialDatumWithUid datum)
        {
            DoExecuteNonQuery($"UPDATE {TABLE} SET {FIELD_NAME}=?,{FIELD_SPEC1}=?,{FIELD_SPEC2}=?,{FIELD_TYPE}=?,{FIELD_UNIT}=?,{FIELD_PRICE}=?,{FIELD_PIC_IMAGE}=?,{FIELD_COMPANY_UID}=? WHERE {FIELD_UID}=?",
                datum.Name, datum.Spec1, datum.Spec2, datum.Type, datum.Unit, datum.Price, datum.Image, datum.CompanyUid, datum.Uid);
        }
        public void Delete(int uid)
        {
            DoExecuteNonQuery($"DELETE FROM {TABLE} WHERE {FIELD_UID}=?",
                uid);
        }
    }
}
