using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCropAPI.DTOs;
using SmartCropAPI.Interfaces;

namespace SmartCropAPI.Controllers;

[Authorize]
public class PredictionController : BaseApiController
{
    private readonly IFileHelperService _fileHelperService;
    private readonly IPredictionService _predictionService;
    private readonly IWebHostEnvironment _env;

    public PredictionController(
        IFileHelperService fileHelperService, 
        IPredictionService predictionService,
        IWebHostEnvironment env)
    {
        _fileHelperService = fileHelperService;
        _predictionService = predictionService;
        _env = env;
    }

    [AllowAnonymous]
    [HttpPost("predict")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PredictionResponse>> PredictFromImage(IFormFile image, [FromForm] string? language = "English")
    {
        try
        {
            // 1. Get User ID from JWT Token if authenticated
            int? userId = null;
            if (User.Identity?.IsAuthenticated == true)
            {
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (int.TryParse(userIdString, out var parsedId))
                {
                    userId = parsedId;
                }
            }

            // 2. Save the uploaded image
            var relativeImagePath = await _fileHelperService.SaveImageAsync(image);
            
            // We need absolute path for ML.NET/ONNX
            var absoluteImagePath = Path.Combine(_env.WebRootPath, relativeImagePath.TrimStart('/'));

            // 3. Run prediction and save to DB (only if authenticated)
            var result = await _predictionService.PredictAndSaveAsync(userId, absoluteImagePath, language ?? "English");
            
            // Fix ImagePath for client (use relative)
            result.ImagePath = relativeImagePath;

            return Ok(result);
        }
        catch (Exception ex)
        {
            var fullMessage = ex.InnerException != null 
                ? $"{ex.Message} → {ex.InnerException.Message}" 
                : ex.Message;
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error during prediction.", details = fullMessage });
        }
    }

    [HttpGet("history")]
    public async Task<ActionResult<IEnumerable<PredictionResponse>>> GetHistory()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out var userId))
            return Unauthorized();

        var history = await _predictionService.GetUserPredictionHistoryAsync(userId);
        return Ok(history);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("all-history")]
    public async Task<ActionResult<IEnumerable<PredictionResponse>>> GetAllHistory()
    {
        var history = await _predictionService.GetAllPredictionHistoryAsync();
        return Ok(history);
    }
}
