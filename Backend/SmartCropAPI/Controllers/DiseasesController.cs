using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCropAPI.Interfaces;
using SmartCropAPI.Models;

namespace SmartCropAPI.Controllers;

[Authorize]
public class DiseasesController : BaseApiController
{
    private readonly IDiseaseService _diseaseService;

    public DiseasesController(IDiseaseService diseaseService)
    {
        _diseaseService = diseaseService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Disease>>> GetDiseases()
    {
        var diseases = await _diseaseService.GetAllDiseasesAsync();
        return Ok(diseases);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Disease>> GetDisease(int id)
    {
        var disease = await _diseaseService.GetDiseaseByIdAsync(id);
        if (disease == null) return NotFound();
        return Ok(disease);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Disease>> CreateDisease(Disease disease)
    {
        var created = await _diseaseService.CreateDiseaseAsync(disease);
        return CreatedAtAction(nameof(GetDisease), new { id = created.Id }, created);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDisease(int id, Disease disease)
    {
        if (id != disease.Id) return BadRequest();
        await _diseaseService.UpdateDiseaseAsync(disease);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDisease(int id)
    {
        await _diseaseService.DeleteDiseaseAsync(id);
        return NoContent();
    }
}
