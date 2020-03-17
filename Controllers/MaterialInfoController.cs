using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using product_and_receipt.Models;
using product_and_receipt.Models.DBs.structures;

namespace product_and_receipt.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MaterialInfoController : ControllerBase
    {
        private readonly ILogger<MaterialInfoController> _logger;

        public MaterialInfoController(ILogger<MaterialInfoController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public TableInfoGetPack Get(int pageSize, int pageIndex, string searchText)
        {
            var companies = GlobalInstance.DB.MaterialTable.GetForApi(pageSize, ref pageIndex, searchText, out int totalCount);

            return new TableInfoGetPack(companies, pageIndex, totalCount);
        }

        [HttpPost]
        public void Post([FromBody]string value)
        {
            MaterialDatum datum = Newtonsoft.Json.JsonConvert.DeserializeObject<MaterialDatum>(value);

            GlobalInstance.DB.RecordTable.Insert("Material Insert", datum);
            GlobalInstance.DB.MaterialTable.Insert(datum);
        }

        [HttpPatch]
        public void Patch([FromBody]string value)
        {
            MaterialDatumWithUid datum = Newtonsoft.Json.JsonConvert.DeserializeObject<MaterialDatumWithUid>(value);

            GlobalInstance.DB.RecordTable.Insert("Material Update", datum);
            GlobalInstance.DB.MaterialTable.Update(datum);
        }

        [HttpDelete]
        public void Delete([FromBody]string value)
        {
            int uid = Newtonsoft.Json.JsonConvert.DeserializeObject<int>(value);

            GlobalInstance.DB.RecordTable.Insert("Material Delete", uid);
            GlobalInstance.DB.MaterialTable.Delete(uid);
        }
    }
}
