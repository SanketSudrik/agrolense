using SmartCropAPI.DTOs;
using SmartCropAPI.Interfaces;
using SmartCropAPI.Models;

namespace SmartCropAPI.Services;

public class CropService : ICropService
{
    private readonly IGenericRepository<Crop> _cropRepository;

    public CropService(IGenericRepository<Crop> cropRepository)
    {
        _cropRepository = cropRepository;
    }

    public async Task<IEnumerable<CropDto>> GetAllCropsAsync()
    {
        var crops = await _cropRepository.ListAllAsync();
        return crops.Select(c => new CropDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            IdealSeason = c.IdealSeason,
            DaysToHarvest = c.DaysToHarvest
        });
    }

    public async Task<CropDto?> GetCropByIdAsync(int id)
    {
        var crop = await _cropRepository.GetByIdAsync(id);
        if (crop == null) return null;

        return new CropDto
        {
            Id = crop.Id,
            Name = crop.Name,
            Description = crop.Description,
            IdealSeason = crop.IdealSeason,
            DaysToHarvest = crop.DaysToHarvest
        };
    }

    public async Task<CropDto> CreateCropAsync(CreateCropDto cropDto)
    {
        var crop = new Crop
        {
            Name = cropDto.Name,
            Description = cropDto.Description,
            IdealSeason = cropDto.IdealSeason,
            DaysToHarvest = cropDto.DaysToHarvest
        };

        await _cropRepository.AddAsync(crop);
        await _cropRepository.SaveChangesAsync();

        return new CropDto
        {
            Id = crop.Id,
            Name = crop.Name,
            Description = crop.Description,
            IdealSeason = crop.IdealSeason,
            DaysToHarvest = crop.DaysToHarvest
        };
    }

    public async Task<bool> UpdateCropAsync(int id, CreateCropDto cropDto)
    {
        var crop = await _cropRepository.GetByIdAsync(id);
        if (crop == null) return false;

        crop.Name = cropDto.Name;
        crop.Description = cropDto.Description;
        crop.IdealSeason = cropDto.IdealSeason;
        crop.DaysToHarvest = cropDto.DaysToHarvest;
        crop.UpdatedAt = DateTime.UtcNow;

        _cropRepository.Update(crop);
        return await _cropRepository.SaveChangesAsync();
    }

    public async Task<bool> DeleteCropAsync(int id)
    {
        var crop = await _cropRepository.GetByIdAsync(id);
        if (crop == null) return false;

        _cropRepository.Delete(crop);
        return await _cropRepository.SaveChangesAsync();
    }
}
