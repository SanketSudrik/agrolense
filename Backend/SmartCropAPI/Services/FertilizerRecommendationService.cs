using SmartCropAPI.DTOs;
using SmartCropAPI.Interfaces;
using SmartCropAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartCropAPI.Services;

public class FertilizerRecommendationService : IFertilizerRecommendationService
{
    private readonly IFertilizerRecommendationRepository _repository;

    public FertilizerRecommendationService(IFertilizerRecommendationRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<FertilizerRecommendationDto>> GetAllAsync()
    {
        var recommendations = await _repository.GetAllAsync();
        return recommendations.Select(MapToDto);
    }

    public async Task<FertilizerRecommendationDto?> GetByIdAsync(int id)
    {
        var recommendation = await _repository.GetByIdAsync(id);
        return recommendation == null ? null : MapToDto(recommendation);
    }

    public async Task<IEnumerable<FertilizerRecommendationDto>> GetByDiseaseNameAsync(string diseaseName)
    {
        var recommendations = await _repository.GetByDiseaseNameAsync(diseaseName);
        return recommendations.Select(MapToDto);
    }

    public async Task<FertilizerRecommendationDto> CreateAsync(CreateFertilizerRecommendationDto createDto)
    {
        var recommendation = new FertilizerRecommendation
        {
            DiseaseName = createDto.DiseaseName,
            RecommendedFertilizer = createDto.RecommendedFertilizer,
            Description = createDto.Description,
            ApplicationRate = createDto.ApplicationRate,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _repository.CreateAsync(recommendation);
        return MapToDto(created);
    }

    public async Task<FertilizerRecommendationDto?> UpdateAsync(int id, UpdateFertilizerRecommendationDto updateDto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return null;

        existing.DiseaseName = updateDto.DiseaseName;
        existing.RecommendedFertilizer = updateDto.RecommendedFertilizer;
        existing.Description = updateDto.Description;
        existing.ApplicationRate = updateDto.ApplicationRate;
        existing.UpdatedAt = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(existing);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    private static FertilizerRecommendationDto MapToDto(FertilizerRecommendation recommendation)
    {
        return new FertilizerRecommendationDto
        {
            Id = recommendation.Id,
            DiseaseName = recommendation.DiseaseName,
            RecommendedFertilizer = recommendation.RecommendedFertilizer,
            Description = recommendation.Description,
            ApplicationRate = recommendation.ApplicationRate,
            CreatedAt = recommendation.CreatedAt,
            UpdatedAt = recommendation.UpdatedAt
        };
    }
}
