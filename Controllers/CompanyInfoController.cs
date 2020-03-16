using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using product_and_receipt.Models;
using product_and_receipt.Models.DBs.structures;

namespace product_and_receipt.Controllers
{
    /*     
        public string Name { get; set; }
        public string Address { get; set; }
        public string Telephone { get; set; }
        public string Fax { get; set; }
         */
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
        public CompanyInfoGetPack Get(int pageSize, int pageIndex, string searchText)
        {
            var companies = GlobalInstance.DB.CompanyTable.Get2(pageSize, ref pageIndex, searchText, out int totalCount);

            return new CompanyInfoGetPack(companies, pageIndex, totalCount);
        }

        [HttpPost]
        public void Post([FromBody]string value)
        {
            CompanyDatum datum = Newtonsoft.Json.JsonConvert.DeserializeObject<CompanyDatum>(value);

            GlobalInstance.DB.CompanyTable.Insert(datum);
        }

        [HttpPatch]
        public void Patch([FromBody]string value)
        {
            CompanyDatumWithUid datum = Newtonsoft.Json.JsonConvert.DeserializeObject<CompanyDatumWithUid>(value);

            GlobalInstance.DB.CompanyTable.Update(datum);
        }

        [HttpDelete]
        public void Delete([FromBody]string value)
        {
            int uid = Newtonsoft.Json.JsonConvert.DeserializeObject<int>(value);

            GlobalInstance.DB.CompanyTable.Delete(uid);
        }
    }

    public class CompanyInfoGetPack
    {
        public List<CompanyDatumWithUid> Data { get; set; }
        public int Page { get; set; }
        public int Total { get; set; }

        public CompanyInfoGetPack(List<CompanyDatumWithUid> data, int page, int total)
        {
            Data = data;
            Page = page;
            Total = total;
        }
    }
}
