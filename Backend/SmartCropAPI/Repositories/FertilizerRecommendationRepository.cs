using Microsoft.EntityFrameworkCore;
using SmartCropAPI.Data;
using SmartCropAPI.Interfaces;
using SmartCropAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartCropAPI.Repositories;

public class FertilizerRecommendationRepository : IFertilizerRecommendationRepository
{
    private readonly AppDbContext _context;

    public FertilizerRecommendationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<FertilizerRecommendation>> GetAllAsync()
    {
        return await _context.FertilizerRecommendations.ToListAsync();
    }

    public async Task<FertilizerRecommendation?> GetByIdAsync(int id)
    {
        return await _context.FertilizerRecommendations.FindAsync(id);
    }

    public async Task<IEnumerable<FertilizerRecommendation>> GetByDiseaseNameAsync(string diseaseName)
    {
        return await _context.FertilizerRecommendations
            .Where(r => r.DiseaseName.ToLower().Contains(diseaseName.ToLower()))
            .ToListAsync();
    }

    public async Task<FertilizerRecommendation> CreateAsync(FertilizerRecommendation recommendation)
    {
        _context.FertilizerRecommendations.Add(recommendation);
        await _context.SaveChangesAsync();
        return recommendation;
    }

    public async Task<FertilizerRecommendation> UpdateAsync(FertilizerRecommendation recommendation)
    {
        _context.FertilizerRecommendations.Update(recommendation);
        await _context.SaveChangesAsync();
        return recommendation;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var recommendation = await _context.FertilizerRecommendations.FindAsync(id);
        if (recommendation == null)
            return false;

        _context.FertilizerRecommendations.Remove(recommendation);
        await _context.SaveChangesAsync();
        return true;
    }
}
