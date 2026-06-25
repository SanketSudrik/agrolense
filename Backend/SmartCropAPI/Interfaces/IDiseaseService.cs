using SmartCropAPI.Models;

namespace SmartCropAPI.Interfaces;

public interface IDiseaseService
{
    Task<IEnumerable<Disease>> GetAllDiseasesAsync();
    Task<Disease?> GetDiseaseByIdAsync(int id);
    Task<Disease> CreateDiseaseAsync(Disease disease);
    Task UpdateDiseaseAsync(Disease disease);
    Task DeleteDiseaseAsync(int id);
    Task<Disease?> GetDiseaseByNameAsync(string name);
}
