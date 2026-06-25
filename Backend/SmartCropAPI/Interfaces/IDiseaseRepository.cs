using SmartCropAPI.Models;

namespace SmartCropAPI.Interfaces;

public interface IDiseaseRepository : IGenericRepository<Disease>
{
    Task<Disease?> GetByNameAsync(string name);
}
