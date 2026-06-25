namespace SmartCropAPI.DTOs;

public class PredictionRequest
{
    public string ImagePath { get; set; } = string.Empty;
}

public class PredictionResponse
{
    public int Id { get; set; }
    public string? PlantName { get; set; }
    public string PredictedDisease { get; set; } = string.Empty;
    public float DamagePercentage { get; set; }
    public string ImagePath { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsHealthy { get; set; }
    public string? DiagnosisSource { get; set; }
    public List<PipelineStageDto>? PipelineStages { get; set; }
    
    // Disease details and treatment recommendations
    public string? DiseaseDescription { get; set; }
    public string? Cure { get; set; }
    public string? Prevention { get; set; }
    public string? Fertilizer { get; set; }
    
    // Database-driven recommendation (legacy support)
    public FertilizerRecommendationDto? Recommendation { get; set; }
}


public class PipelineStageDto
{
    public string Stage { get; set; } = string.Empty;
    public string Result { get; set; } = string.Empty;
    public string? ModelUsed { get; set; }
    public long ElapsedMs { get; set; }
}
