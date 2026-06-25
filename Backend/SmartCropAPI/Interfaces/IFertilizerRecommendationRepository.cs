using SmartCropAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartCropAPI.Interfaces;

public interface IFertilizerRecommendationRepository
{
    Task<IEnumerable<FertilizerRecommendation>> GetAllAsync();
    Task<FertilizerRecommendation?> GetByIdAsync(int id);
    Task<IEnumerable<FertilizerRecommendation>> GetByDiseaseNameAsync(string diseaseName);
    Task<FertilizerRecommendation> CreateAsync(FertilizerRecommendation recommendation);
    Task<FertilizerRecommendation> UpdateAsync(FertilizerRecommendation recommendation);
    Task<bool> DeleteAsync(int id);
}
