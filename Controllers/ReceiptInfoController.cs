using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using product_and_receipt.Models;
using product_and_receipt.Models.DBs.Structures;
using System;
using System.Collections.Generic;

namespace product_and_receipt.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReceiptInfoController : ControllerBase
    {
        private readonly ILogger<ReceiptInfoController> _logger;

        public ReceiptInfoController(ILogger<ReceiptInfoController> logger)
        {
            _logger = logger;
        }

        // test
        /*
        [HttpGet]
        public bool Get()
        {
            ReceiptDatum receipt = new ReceiptDatum("testid", "testpayee", DateTime.Now);
            receipt.AddItem(new ReceiptItemDatum("pname1-1", 1.10M, 10));
            receipt.AddItem(new ReceiptItemDatum("pname1-2", 1.20M, 2));
            receipt.AddItem(new ReceiptItemDatum("pname1-3", 1.40M, 4));
            GlobalInstance.DB.ReceiptTable.Insert(receipt);

            ReceiptDatum receipt2 = new ReceiptDatum("testid", "testpayee2", DateTime.Now.AddHours(5));
            receipt2.AddItem(new ReceiptItemDatum("pname2-1", 1.10M, 10));
            receipt2.AddItem(new ReceiptItemDatum("pname2-2", 1.20M, 2));
            receipt2.AddItem(new ReceiptItemDatum("pname2-3", 1.40M, 4));
            GlobalInstance.DB.ReceiptTable.Insert(receipt2);

            ReceiptDatum receipt3 = new ReceiptDatum("testid_update", "testpayee3", DateTime.Now);
            receipt3.AddItem(new ReceiptItemDatum("pname3-1", 1.11M, 11));
            receipt3.AddItem(new ReceiptItemDatum("pname_u-1", 1.70M, 7));
            int updateReceiptUid = GlobalInstance.DB.ReceiptTable.Insert(receipt3);

            ReceiptDatum receipt4 = new ReceiptDatum("testid_del", "testpayee3", DateTime.Now);
            int delReceiptUid = GlobalInstance.DB.ReceiptTable.Insert(receipt4);


            ReceiptDatumWithUid updateReceipt = new ReceiptDatumWithUid(updateReceiptUid, "testid_update", "update_payee", DateTime.Now.AddHours(12));
            updateReceipt.AddItem(new ReceiptItemDatum("pname_u-1", 1.10M, 10));
            updateReceipt.AddItem(new ReceiptItemDatum("pname_u-2", 1.20M, 2));
            updateReceipt.AddItem(new ReceiptItemDatum("pname_u-3", 1.40M, 4));

            GlobalInstance.DB.ReceiptTable.Update(updateReceipt);
            GlobalInstance.DB.ReceiptTable.Delete(delReceiptUid);

            return true;
        }
        */


        //[HttpGet]
        //public TableInfoGetPack Get(int pageSize, int pageIndex, string searchText)
        //{
        //    var companies = GlobalInstance.DB.ReceiptTable.GetForApi(pageSize, ref pageIndex, searchText, out int totalCount);

        //    return new TableInfoGetPack(companies, pageIndex, totalCount);
        //}
        [HttpGet]
        public List<ReceiptDatumWithUid> Get()
        {
            var list = GlobalInstance.DB.ReceiptTable.Get();
            return list;
        }

        [HttpPost]
        public void Post([FromBody]string value)
        {
            ReceiptDatum datum = Newtonsoft.Json.JsonConvert.DeserializeObject<ReceiptDatum>(value);

            GlobalInstance.DB.RecordTable.Insert("Receipt Insert", datum);
            GlobalInstance.DB.ReceiptTable.Insert(datum);
        }

        [HttpPatch]
        public void Patch([FromBody]string value)
        {
            ReceiptDatumWithUid datum = Newtonsoft.Json.JsonConvert.DeserializeObject<ReceiptDatumWithUid>(value);

            GlobalInstance.DB.RecordTable.Insert("Receipt Update", datum);
            GlobalInstance.DB.ReceiptTable.Update(datum);
        }

        [HttpDelete]
        public void Delete([FromBody]string value)
        {
            int uid = Newtonsoft.Json.JsonConvert.DeserializeObject<int>(value);

            GlobalInstance.DB.RecordTable.Insert("Receipt Delete", uid);
            GlobalInstance.DB.ReceiptTable.Delete(uid);
        }
    }
}
