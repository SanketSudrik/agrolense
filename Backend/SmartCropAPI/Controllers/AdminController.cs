using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SmartCropAPI.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : BaseApiController
{
    private readonly SmartCropAPI.Data.AppDbContext _context;

    public AdminController(SmartCropAPI.Data.AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetAdminDashboard()
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalPredictions = await _context.CropPredictions.CountAsync();
        var totalDiseases = await _context.Diseases.CountAsync();
        var totalCrops = await _context.Crops.CountAsync();

        return Ok(new
        {
            TotalUsers = totalUsers,
            TotalPredictions = totalPredictions,
            TotalDiseases = totalDiseases,
            TotalCrops = totalCrops
        });
    }
}
