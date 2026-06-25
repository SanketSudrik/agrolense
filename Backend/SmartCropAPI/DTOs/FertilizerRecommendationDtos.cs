using System;
using System.ComponentModel.DataAnnotations;

namespace SmartCropAPI.DTOs;

public class FertilizerRecommendationDto
{
    public int Id { get; set; }
    public string DiseaseName { get; set; } = string.Empty;
    public string RecommendedFertilizer { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ApplicationRate { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateFertilizerRecommendationDto
{
    [Required]
    [MaxLength(200)]
    public string DiseaseName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string RecommendedFertilizer { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ApplicationRate { get; set; } = string.Empty;
}

public class UpdateFertilizerRecommendationDto
{
    [Required]
    [MaxLength(200)]
    public string DiseaseName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string RecommendedFertilizer { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ApplicationRate { get; set; } = string.Empty;
}
