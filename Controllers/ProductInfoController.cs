using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using product_and_receipt.Models;
using product_and_receipt.Models.DBs.structures;
using System.Collections.Generic;

namespace product_and_receipt.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductInfoController : ControllerBase
    {
        private readonly ILogger<ProductInfoController> _logger;

        public ProductInfoController(ILogger<ProductInfoController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public TableInfoGetPack Get(int pageSize, int pageIndex, string searchText)
        {
            var companies = GlobalInstance.DB.ProductTable.GetForApi(pageSize, ref pageIndex, searchText, out int totalCount);

            return new TableInfoGetPack(companies, pageIndex, totalCount);
        }

        [HttpPost]
        public void Post([FromBody]string value)
        {
            ProductDatum datum = Newtonsoft.Json.JsonConvert.DeserializeObject<ProductDatum>(value);

            GlobalInstance.DB.ProductTable.Insert(datum);
        }

        [HttpPatch]
        public void Patch([FromBody]string value)
        {
            ProductDatumWithUid datum = Newtonsoft.Json.JsonConvert.DeserializeObject<ProductDatumWithUid>(value);

            GlobalInstance.DB.ProductTable.Update(datum);
        }

        [HttpDelete]
        public void Delete([FromBody]string value)
        {
            int uid = Newtonsoft.Json.JsonConvert.DeserializeObject<int>(value);

            GlobalInstance.DB.ProductTable.Delete(uid);
        }
    }
}
