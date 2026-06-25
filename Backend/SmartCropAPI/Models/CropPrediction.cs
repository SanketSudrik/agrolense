namespace SmartCropAPI.Models;

public class CropPrediction : BaseEntity
{
    public int UserId { get; set; }
    
    // Navigation Property
    public User User { get; set; } = null!;

    public string ImagePath { get; set; } = string.Empty;
    public string? PlantName { get; set; }
    public string? PredictedDisease { get; set; }
    public float DamagePercentage { get; set; }
    
    // New fields for production-ready system
    public string? Description { get; set; }
    public string? Cure { get; set; }
    public string? Prevention { get; set; }
    public string? Fertilizer { get; set; }
}
