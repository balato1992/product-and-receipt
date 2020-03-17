using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using product_and_receipt.Models;
using product_and_receipt.Models.DBs.structures;
using System.Collections.Generic;

namespace product_and_receipt.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CompanyInfoController : ControllerBase
    {
        private readonly ILogger<CompanyInfoController> _logger;

        public CompanyInfoController(ILogger<CompanyInfoController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public TableInfoGetPack Get(int pageSize, int pageIndex, string searchText)
        {
            var companies = GlobalInstance.DB.CompanyTable.GetForApi(pageSize, ref pageIndex, searchText, out int totalCount);

            return new TableInfoGetPack(companies, pageIndex, totalCount);
        }

        [HttpPost]
        public void Post([FromBody]string value)
        {
            CompanyDatum datum = Newtonsoft.Json.JsonConvert.DeserializeObject<CompanyDatum>(value);

            GlobalInstance.DB.RecordTable.Insert("Company Insert", datum);
            GlobalInstance.DB.CompanyTable.Insert(datum);
        }

        [HttpPatch]
        public void Patch([FromBody]string value)
        {
            CompanyDatumWithUid datum = Newtonsoft.Json.JsonConvert.DeserializeObject<CompanyDatumWithUid>(value);

            GlobalInstance.DB.RecordTable.Insert("Company Update", datum);
            GlobalInstance.DB.CompanyTable.Update(datum);
        }

        [HttpDelete]
        public void Delete([FromBody]string value)
        {
            int uid = Newtonsoft.Json.JsonConvert.DeserializeObject<int>(value);

            GlobalInstance.DB.RecordTable.Insert("Company Delete", uid);
            GlobalInstance.DB.CompanyTable.Delete(uid);
        }
    }

    public class TableInfoGetPack
    {
        public object Data { get; set; }
        public int Page { get; set; }
        public int Total { get; set; }

        public TableInfoGetPack(object data, int page, int total)
        {
            Data = data;
            Page = page;
            Total = total;
        }
    }
}
