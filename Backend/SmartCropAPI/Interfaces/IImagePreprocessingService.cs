namespace SmartCropAPI.Interfaces;

/// <summary>
/// Converts a raw image file into a flat float tensor (NCHW format)
/// suitable for ONNX Runtime inference.
/// </summary>
public interface IImagePreprocessingService
{
    /// <summary>Preprocess at the default 224×224 resolution.</summary>
    Task<float[]> PreprocessImageAsync(string imagePath);

    /// <summary>
    /// Preprocess at a custom resolution — used when a specialist model
    /// was trained at a different input size (e.g. 300×300).
    /// </summary>
    Task<float[]> PreprocessImageAsync(string imagePath, int width, int height);
}
