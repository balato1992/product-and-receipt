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
    public class CompanyController : ControllerBase
    {
        private readonly ILogger<CompanyController> _logger;

        public CompanyController(ILogger<CompanyController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<CompanyDatumWithUid> Get()
        {
            return GlobalInstance.DB.CompanyTable.Get();
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
    }
}
