using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SmartCropAPI.Controllers;

[Authorize(Roles = "Farmer,Admin")] // Both Farmer and Admin can access this
public class FarmerController : BaseApiController
{
    [HttpGet("profile")]
    public IActionResult GetFarmerProfile()
    {
        return Ok(new { message = "Welcome to the Farmer Profile! You have limited access." });
    }
}
