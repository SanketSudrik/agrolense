using SmartCropAPI.DTOs;

namespace SmartCropAPI.Interfaces;

public interface ICropService
{
    Task<IEnumerable<CropDto>> GetAllCropsAsync();
    Task<CropDto?> GetCropByIdAsync(int id);
    Task<CropDto> CreateCropAsync(CreateCropDto cropDto);
    Task<bool> UpdateCropAsync(int id, CreateCropDto cropDto);
    Task<bool> DeleteCropAsync(int id);
}
