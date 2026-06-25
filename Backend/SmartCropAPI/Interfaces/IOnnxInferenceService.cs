namespace SmartCropAPI.Interfaces;

// ═══════════════════════════════════════════════════════════════
//  ENUMS & SUPPORT TYPES
// ═══════════════════════════════════════════════════════════════

/// <summary>Identifies which specialist disease-detection model to invoke.</summary>
public enum SpecialistModel
{
    PlantVillageGeneral,   // Fruits & vegetables (38 PlantVillage classes)
    RiceLeafSpecialist,    // Paddy / rice diseases
    CottonDiseaseNet,      // Cotton diseases
    SugarcaneExpert,       // Sugarcane diseases
    OpenCVHeuristic        // Fallback — no specialist model available
}

/// <summary>One step recorded during the multi-stage inference pipeline.</summary>
public class PipelineStage
{
    public string Stage { get; set; } = "";
    public string Result { get; set; } = "";
    public string? ModelUsed { get; set; }
    public float? Confidence { get; set; }
    public long ElapsedMs { get; set; }
}

/// <summary>Top-N prediction entry produced by any specialist model.</summary>
public class TopPrediction
{
    public string PlantName  { get; set; } = "";
    public string DiseaseName { get; set; } = "";
    public float  Confidence  { get; set; }
    public bool   IsHealthy   { get; set; }
}

/// <summary>
/// Full diagnostic result returned by the hierarchical inference pipeline.
/// </summary>
public class PlantDiagnosisResult
{
    // ── Identification ──────────────────────────────────────────
    public string PlantName        { get; set; } = "Unknown";
    public string PlantFamily      { get; set; } = "Unknown";   // e.g. "Solanum", "Oryza"
    public float  RouterConfidence { get; set; }                 // Router model confidence

    // ── Disease ─────────────────────────────────────────────────
    public string DiseaseName      { get; set; } = "Unknown";
    public bool   IsHealthy        { get; set; }
    public float  Confidence       { get; set; }
    public float  DamagePercentage { get; set; }
    public List<TopPrediction> TopPredictions { get; set; } = new();

    // ── Treatment ───────────────────────────────────────────────
    public string? DiseaseDescription      { get; set; }
    public string? Cure                    { get; set; }
    public string? Prevention              { get; set; }
    public string? FertilizerRecommendation { get; set; }

    // ── Pipeline metadata ────────────────────────────────────────
    public SpecialistModel     SpecialistUsed { get; set; }
    public string              DiagnosisSource { get; set; } = "Heuristic";
    public List<PipelineStage> PipelineStages  { get; set; } = new();
}

// ═══════════════════════════════════════════════════════════════
//  INTERFACE
// ═══════════════════════════════════════════════════════════════

public interface IOnnxInferenceService
{
    /// <summary>
    /// Runs the hierarchical Router → Specialist → Knowledge-Base pipeline.
    /// </summary>
    Task<PlantDiagnosisResult> PredictDiseaseAsync(string imagePath);
}
