using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCropAPI.DTOs;
using SmartCropAPI.Interfaces;

namespace SmartCropAPI.Controllers;

public class CropsController : BaseApiController
{
    private readonly ICropService _cropService;

    public CropsController(ICropService cropService)
    {
        _cropService = cropService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CropDto>>> GetCrops()
    {
        var crops = await _cropService.GetAllCropsAsync();
        return Ok(crops);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CropDto>> GetCrop(int id)
    {
        var crop = await _cropService.GetCropByIdAsync(id);
        if (crop == null) return NotFound();

        return Ok(crop);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CropDto>> CreateCrop([FromBody] CreateCropDto cropDto)
    {
        var crop = await _cropService.CreateCropAsync(cropDto);
        return CreatedAtAction(nameof(GetCrop), new { id = crop.Id }, crop);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateCrop(int id, [FromBody] CreateCropDto cropDto)
    {
        var result = await _cropService.UpdateCropAsync(id, cropDto);
        if (!result) return NotFound();

        return Ok(new { message = "Crop updated successfully." });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCrop(int id)
    {
        var result = await _cropService.DeleteCropAsync(id);
        if (!result) return NotFound();

        return Ok(new { message = "Crop deleted successfully." });
    }
}
