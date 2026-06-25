using SmartCropAPI.Interfaces;
using SmartCropAPI.Models;

namespace SmartCropAPI.Services;

public class DiseaseService : IDiseaseService
{
    private readonly IDiseaseRepository _diseaseRepository;

    public DiseaseService(IDiseaseRepository diseaseRepository)
    {
        _diseaseRepository = diseaseRepository;
    }

    public async Task<IEnumerable<Disease>> GetAllDiseasesAsync()
    {
        return await _diseaseRepository.ListAllAsync();
    }

    public async Task<Disease?> GetDiseaseByIdAsync(int id)
    {
        return await _diseaseRepository.GetByIdAsync(id);
    }

    public async Task<Disease> CreateDiseaseAsync(Disease disease)
    {
        var created = await _diseaseRepository.AddAsync(disease);
        await _diseaseRepository.SaveChangesAsync();
        return created;
    }

    public async Task UpdateDiseaseAsync(Disease disease)
    {
        disease.UpdatedAt = DateTime.UtcNow;
        _diseaseRepository.Update(disease);
        await _diseaseRepository.SaveChangesAsync();
    }

    public async Task DeleteDiseaseAsync(int id)
    {
        var disease = await _diseaseRepository.GetByIdAsync(id);
        if (disease != null)
        {
            _diseaseRepository.Delete(disease);
            await _diseaseRepository.SaveChangesAsync();
        }
    }

    public async Task<Disease?> GetDiseaseByNameAsync(string name)
    {
        return await _diseaseRepository.GetByNameAsync(name);
    }
}
