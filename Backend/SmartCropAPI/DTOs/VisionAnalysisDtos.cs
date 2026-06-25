using System.Text.Json.Serialization;

namespace SmartCropAPI.DTOs;

/// <summary>
/// Structured output from the custom vision analysis pipeline.
/// Contains plant identification, disease classification, and treatment data.
/// </summary>
public class VisionAnalysisResult
{
    [JsonPropertyName("plant_name")]
    public string PlantName { get; set; } = string.Empty;

    [JsonPropertyName("disease_name")]
    public string DiseaseName { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("damage_percentage")]
    public string DamagePercentage { get; set; } = string.Empty;

    [JsonPropertyName("cure")]
    public string Cure { get; set; } = string.Empty;

    [JsonPropertyName("prevention")]
    public string Prevention { get; set; } = string.Empty;

    [JsonPropertyName("fertilization")]
    public string Fertilization { get; set; } = string.Empty;
}
