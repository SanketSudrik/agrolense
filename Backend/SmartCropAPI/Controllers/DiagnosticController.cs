using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCropAPI.DTOs;
using SmartCropAPI.Interfaces;

namespace SmartCropAPI.Controllers;

/// <summary>
/// Standalone diagnostic endpoint for direct vision-based plant analysis.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DiagnosticController : ControllerBase
{
    private readonly IVisionAnalysisEngine _analysisEngine;

    public DiagnosticController(IVisionAnalysisEngine analysisEngine)
    {
        _analysisEngine = analysisEngine;
    }

    [HttpPost("analyze")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VisionAnalysisResult>> AnalyzeImage(IFormFile image)
    {
        if (image == null || image.Length == 0)
        {
            return BadRequest(new { message = "No image provided." });
        }

        try
        {
            using var ms = new MemoryStream();
            await image.CopyToAsync(ms);
            var fileBytes = ms.ToArray();
            var base64Image = Convert.ToBase64String(fileBytes);

            var result = await _analysisEngine.AnalyzeImageAsync(base64Image, image.ContentType);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Error during diagnostic analysis.", details = ex.Message });
        }
    }
}
