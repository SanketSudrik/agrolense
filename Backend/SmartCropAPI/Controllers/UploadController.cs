using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCropAPI.DTOs;
using SmartCropAPI.Interfaces;

namespace SmartCropAPI.Controllers;

[Authorize]
public class UploadController : BaseApiController
{
    private readonly IFileHelperService _fileHelperService;

    public UploadController(IFileHelperService fileHelperService)
    {
        _fileHelperService = fileHelperService;
    }

    [HttpPost("image")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UploadResponseDto>> UploadImage(IFormFile file)
    {
        try
        {
            var imagePath = await _fileHelperService.SaveImageAsync(file);
            return Ok(new UploadResponseDto { ImagePath = imagePath, Message = "Image uploaded successfully." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while uploading the file.", details = ex.Message });
        }
    }
}
