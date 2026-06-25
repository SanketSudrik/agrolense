using Microsoft.AspNetCore.Mvc;
using SmartCropAPI.DTOs;
using SmartCropAPI.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartCropAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FertilizerRecommendationsController : ControllerBase
{
    private readonly IFertilizerRecommendationService _service;

    public FertilizerRecommendationsController(IFertilizerRecommendationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FertilizerRecommendationDto>>> GetAll()
    {
        var recommendations = await _service.GetAllAsync();
        return Ok(recommendations);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FertilizerRecommendationDto>> GetById(int id)
    {
        var recommendation = await _service.GetByIdAsync(id);
        if (recommendation == null)
            return NotFound(new { message = $"Recommendation with ID {id} not found." });

        return Ok(recommendation);
    }

    [HttpGet("disease/{diseaseName}")]
    public async Task<ActionResult<IEnumerable<FertilizerRecommendationDto>>> GetByDisease(string diseaseName)
    {
        var recommendations = await _service.GetByDiseaseNameAsync(diseaseName);
        return Ok(recommendations);
    }

    [HttpPost]
    public async Task<ActionResult<FertilizerRecommendationDto>> Create(CreateFertilizerRecommendationDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _service.CreateAsync(createDto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<FertilizerRecommendationDto>> Update(int id, UpdateFertilizerRecommendationDto updateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _service.UpdateAsync(id, updateDto);
        if (updated == null)
            return NotFound(new { message = $"Recommendation with ID {id} not found." });

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Recommendation with ID {id} not found." });

        return NoContent();
    }
}
