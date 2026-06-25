using SmartCropAPI.DTOs;

namespace SmartCropAPI.Interfaces;

/// <summary>
/// AgriVision Deep Analysis Engine for plant disease detection.
/// Implements proprietary multi-modal classification and diagnostic output.
/// </summary>
public interface IVisionAnalysisEngine
{
    Task<VisionAnalysisResult> AnalyzeImageAsync(string base64Image, string mimeType, string language = "English");
}
