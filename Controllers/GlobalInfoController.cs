using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using product_and_receipt.Models;

namespace product_and_receipt.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GlobalInfoController : ControllerBase
    {
        private readonly ILogger<DBVersionController> _logger;

        public GlobalInfoController(ILogger<DBVersionController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public string Get()
        {
            string root = GlobalInstance.ContentRoot;

            return root;
        }
    }
}
