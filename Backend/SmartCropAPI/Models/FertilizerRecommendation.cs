using System;
using System.ComponentModel.DataAnnotations;

namespace SmartCropAPI.Models;

/// <summary>
/// Entity representing a fertilizer recommendation based on a specific disease.
/// </summary>
public class FertilizerRecommendation : BaseEntity
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

    public string? Cure { get; set; }
    public string? Prevention { get; set; }
}
