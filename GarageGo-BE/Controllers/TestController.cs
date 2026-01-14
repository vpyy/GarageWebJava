using Microsoft.AspNetCore.Mvc;

namespace GarageGo_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { 
                message = "GarageGo Backend API is running!", 
                timestamp = DateTime.Now,
                version = "1.0.0"
            });
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { 
                status = "healthy", 
                service = "GarageGo-BE",
                timestamp = DateTime.Now
            });
        }
    }
}