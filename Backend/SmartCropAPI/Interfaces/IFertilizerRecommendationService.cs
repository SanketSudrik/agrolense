using SmartCropAPI.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartCropAPI.Interfaces;

public interface IFertilizerRecommendationService
{
    Task<IEnumerable<FertilizerRecommendationDto>> GetAllAsync();
    Task<FertilizerRecommendationDto?> GetByIdAsync(int id);
    Task<IEnumerable<FertilizerRecommendationDto>> GetByDiseaseNameAsync(string diseaseName);
    Task<FertilizerRecommendationDto> CreateAsync(CreateFertilizerRecommendationDto createDto);
    Task<FertilizerRecommendationDto?> UpdateAsync(int id, UpdateFertilizerRecommendationDto updateDto);
    Task<bool> DeleteAsync(int id);
}
