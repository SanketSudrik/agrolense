using Microsoft.EntityFrameworkCore;
using SmartCropAPI.Data;
using SmartCropAPI.Interfaces;
using SmartCropAPI.Models;

namespace SmartCropAPI.Repositories;

public class DiseaseRepository : GenericRepository<Disease>, IDiseaseRepository
{
    public DiseaseRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Disease?> GetByNameAsync(string name)
    {
        return await _context.Diseases
            .FirstOrDefaultAsync(d => d.Name.ToLower() == name.ToLower());
    }
}
