using SmartCropAPI.DTOs;
using SmartCropAPI.Interfaces;
using SmartCropAPI.Models;
using System.Text.Json;

namespace SmartCropAPI.Services;

/// <summary>
/// Orchestrates the full prediction workflow: image analysis, disease lookup,
/// database persistence, and response composition.
/// </summary>

public class PredictionService : IPredictionService
{
    private readonly IOnnxInferenceService _onnxInferenceService;
    private readonly IVisionAnalysisEngine _visionEngine;
    private readonly IGenericRepository<CropPrediction> _predictionRepository;
    private readonly IFertilizerRecommendationRepository _fertilizerRepository;
    private readonly IDiseaseRepository _diseaseRepository;
    private readonly ILogger<PredictionService> _logger;

    public PredictionService(
        IOnnxInferenceService onnxInferenceService,
        IVisionAnalysisEngine visionEngine,
        IGenericRepository<CropPrediction> predictionRepository,
        IFertilizerRecommendationRepository fertilizerRepository,
        IDiseaseRepository diseaseRepository,
        ILogger<PredictionService> logger)
    {
        _onnxInferenceService = onnxInferenceService;
        _visionEngine = visionEngine;
        _predictionRepository = predictionRepository;
        _fertilizerRepository = fertilizerRepository;
        _diseaseRepository = diseaseRepository;
        _logger = logger;
    }

    public async Task<PredictionResponse> PredictAndSaveAsync(int? userId, string imagePath, string language = "English")
    {
        // 1. Get image bytes and MIME type for the vision analysis engine
        var imageBytes = await File.ReadAllBytesAsync(imagePath);
        var base64Image = Convert.ToBase64String(imageBytes);
        var extension = Path.GetExtension(imagePath).ToLower();
        var mimeType = extension switch
        {
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            _ => "image/jpeg"
        };

        // 2. Run deep vision analysis (with fallback to ONNX/Heuristic pipeline)
        VisionAnalysisResult? visionResult = null;
        try
        {
            visionResult = await _visionEngine.AnalyzeImageAsync(base64Image, mimeType, language);
            _logger.LogInformation("AgriVision engine returned result for plant: {Plant}, disease: {Disease}", 
                visionResult?.PlantName, visionResult?.DiseaseName);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "AgriVision engine unavailable ({Message}), falling back to local pipeline.", ex.Message);
        }

        // 3. Run standard Hierarchical AI pipeline
        var diagnosis = await _onnxInferenceService.PredictDiseaseAsync(imagePath);

        // 4. Merge results (Prioritize vision engine if successful)
        bool useVisionEngine = visionResult != null;
        
        var plantName = (useVisionEngine && !string.IsNullOrWhiteSpace(visionResult!.PlantName)) 
            ? visionResult.PlantName : (diagnosis.PlantName ?? "Unknown Plant");
            
        var diseaseName = (useVisionEngine && !string.IsNullOrWhiteSpace(visionResult!.DiseaseName)) 
            ? visionResult.DiseaseName : (diagnosis.DiseaseName ?? "Unknown Condition");
            
        var diagnosisSource = useVisionEngine ? "AgriVision-Ensemble" : diagnosis.DiagnosisSource;
        
        var description = (useVisionEngine && !string.IsNullOrWhiteSpace(visionResult!.Description)) 
            ? visionResult.Description : (diagnosis.DiseaseDescription ?? "No description available.");
            
        var cure = (useVisionEngine && !string.IsNullOrWhiteSpace(visionResult!.Cure)) 
            ? visionResult.Cure : (diagnosis.Cure ?? "Consult an agricultural expert.");
            
        var fertilizer = (useVisionEngine && !string.IsNullOrWhiteSpace(visionResult!.Fertilization)) 
            ? visionResult.Fertilization : (diagnosis.FertilizerRecommendation ?? "Balanced NPK fertilizer.");

        // 5. Try to get additional recommendation from database (seeded data)
        var dbRecommendations = await _fertilizerRepository.GetByDiseaseNameAsync(diseaseName);
        var dbRec = dbRecommendations.FirstOrDefault();

        // 6. Parse damage percentage (Robust parsing)
        float damageVal = diagnosis.DamagePercentage;
        if (useVisionEngine && !string.IsNullOrWhiteSpace(visionResult!.DamagePercentage))
        {
            // Extract the first number found in the string (handles "25%", "25-30%", "Approx 25")
            var match = System.Text.RegularExpressions.Regex.Match(visionResult.DamagePercentage, @"\d+(\.\d+)?");
            if (match.Success && float.TryParse(match.Value, out var vDamage)) 
            {
                damageVal = vDamage;
            }
        }

        // 7. Apply fallback details if not provided by Gemini
        string? prevention = null;

        if (diseaseName.Contains("Invalid", StringComparison.OrdinalIgnoreCase) || 
            diseaseName.Contains("Not a Plant", StringComparison.OrdinalIgnoreCase) || 
            plantName.Contains("Not a Plant", StringComparison.OrdinalIgnoreCase) ||
            diseaseName.Contains("No Plant Detected", StringComparison.OrdinalIgnoreCase))
        {
            plantName = "Not a Plant";
            diseaseName = "Invalid Image";
            description ??= "The uploaded image does not appear to be a plant. Please upload a clear image of a plant leaf or crop.";
            cure ??= "Not applicable for non-plant images.";
            prevention ??= "Ensure the image clearly shows the plant leaf without too much background.";
            fertilizer ??= "Not applicable.";
        }
        else if (diseaseName.Contains("Unknown", StringComparison.OrdinalIgnoreCase))
        {
            diseaseName = "Unknown Condition";
            description = null;
            cure = null;
            prevention = null;
            fertilizer = null;
            
            // If the database has rich information for this disease, merge it in as a fallback
            if (dbRec != null)
            {
                if (string.IsNullOrWhiteSpace(description) || description == "No description available.") description = dbRec.Description;
                if (string.IsNullOrWhiteSpace(cure) || cure == "Consult an agricultural expert.") cure = dbRec.Cure;
                prevention = dbRec.Prevention;
                if (string.IsNullOrWhiteSpace(fertilizer) || fertilizer == "Balanced NPK fertilizer.") fertilizer = dbRec.RecommendedFertilizer;
            }
            
            // Final fallback for missing fields
            description ??= "Information currently unavailable.";
            cure ??= "Information currently unavailable.";
            prevention ??= "Information currently unavailable.";
            fertilizer ??= "Information currently unavailable.";
        }
        else
        {
            // If the database has rich information for this disease, merge it in as a fallback
            if (dbRec != null)
            {
                if (string.IsNullOrWhiteSpace(description) || description == "No description available.") description = dbRec.Description;
                if (string.IsNullOrWhiteSpace(cure) || cure == "Consult an agricultural expert.") cure = dbRec.Cure;
                prevention = dbRec.Prevention;
                if (string.IsNullOrWhiteSpace(fertilizer) || fertilizer == "Balanced NPK fertilizer.") fertilizer = dbRec.RecommendedFertilizer;
            }
            
            // Final fallback for missing fields
            description ??= "Information currently unavailable.";
            cure ??= "Information currently unavailable.";
            prevention ??= "Information currently unavailable.";
            fertilizer ??= "Information currently unavailable.";
        }

        // 8. Build pipeline stages DTO
        var pipelineStages = diagnosis.PipelineStages;
        if (useVisionEngine)
        {
            pipelineStages.Add(new PipelineStage { 
                Stage = "AgriVision-Ensemble", 
                Result = diseaseName, 
                ModelUsed = "AgriVision-DNN-v3", 
                Confidence = 1.0f 
            });
        }

        var pipelineStageDtos = pipelineStages.Select(s => new PipelineStageDto
        {
            Stage = s.Stage,
            Result = s.Result,
            ModelUsed = s.ModelUsed,
            ElapsedMs = s.ElapsedMs
        }).ToList();

        // 10. Save to database
        var predictionRecord = new CropPrediction
        {
            UserId = userId ?? 0, // Fallback if needed, though we won't save if null
            ImagePath = imagePath,
            PlantName = plantName,
            PredictedDisease = diseaseName,
            DamagePercentage = damageVal,
            Description = description,
            Cure = cure,
            Prevention = prevention,
            Fertilizer = fertilizer
        };

        if (userId.HasValue)
        {
            await _predictionRepository.AddAsync(predictionRecord);
            await _predictionRepository.SaveChangesAsync();
        }

        // 11. Build and return response
        return new PredictionResponse
        {
            Id = predictionRecord.Id,
            PlantName = plantName,
            PredictedDisease = diseaseName,
            DamagePercentage = damageVal,
            ImagePath = imagePath,
            CreatedAt = predictionRecord.CreatedAt,
            PipelineStages = pipelineStageDtos,
            DiseaseDescription = description,
            Cure = cure,
            Prevention = prevention,
            Fertilizer = fertilizer,
            IsHealthy = diseaseName.Contains("Healthy", StringComparison.OrdinalIgnoreCase),
            DiagnosisSource = diagnosisSource,
            Recommendation = dbRec != null ? new FertilizerRecommendationDto
            {
                Id = dbRec.Id,
                DiseaseName = dbRec.DiseaseName,
                RecommendedFertilizer = dbRec.RecommendedFertilizer,
                Description = dbRec.Description,
                ApplicationRate = dbRec.ApplicationRate
            } : null
        };
    }

    public async Task<IEnumerable<PredictionResponse>> GetUserPredictionHistoryAsync(int userId)
    {
        var predictions = await _predictionRepository.ListAllAsync();
        return MapPredictionsToResponse(predictions.Where(p => p.UserId == userId));
    }

    public async Task<IEnumerable<PredictionResponse>> GetAllPredictionHistoryAsync()
    {
        var predictions = await _predictionRepository.ListAllAsync();
        return MapPredictionsToResponse(predictions);
    }

    private IEnumerable<PredictionResponse> MapPredictionsToResponse(IEnumerable<CropPrediction> predictions)
    {
        return predictions.OrderByDescending(x => x.CreatedAt).Select(p =>
        {
            bool isHealthy = p.PredictedDisease?.Contains("Healthy", StringComparison.OrdinalIgnoreCase) == true;

            return new PredictionResponse
            {
                Id = p.Id,
                PlantName = p.PlantName ?? "Unknown Plant",
                PredictedDisease = p.PredictedDisease ?? "Unknown",
                DamagePercentage = p.DamagePercentage,
                ImagePath = p.ImagePath,
                CreatedAt = p.CreatedAt,
                DiseaseDescription = p.Description,
                Cure = p.Cure,
                Prevention = p.Prevention,
                Fertilizer = p.Fertilizer,
                IsHealthy = isHealthy
            };
        }).ToList();
    }
}
