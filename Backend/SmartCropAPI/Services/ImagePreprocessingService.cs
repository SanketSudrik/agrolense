using OpenCvSharp;
using SmartCropAPI.Interfaces;

namespace SmartCropAPI.Services;

/// <summary>
/// Preprocessing service that converts a raw image file into a flat float tensor
/// compatible with ONNX Runtime's NCHW input format.
/// Supports configurable target resolution so each specialist model can use
/// the resolution it was trained with.
/// </summary>
public class ImagePreprocessingService : IImagePreprocessingService
{
    // Default: 224×224 — standard for MobileNet / EfficientNet-B0
    private const int DefaultWidth  = 224;
    private const int DefaultHeight = 224;

    // ImageNet normalisation (mean / std per channel, RGB order)
    private static readonly float[] Mean = { 0.485f, 0.456f, 0.406f };
    private static readonly float[] Std  = { 0.229f, 0.224f, 0.225f };

    // ── Primary interface method (default 224×224) ───────────────
    public Task<float[]> PreprocessImageAsync(string imagePath)
        => Task.FromResult(Preprocess(imagePath, DefaultWidth, DefaultHeight));

    // ── Overload for specialist models with different input sizes ─
    public Task<float[]> PreprocessImageAsync(string imagePath, int width, int height)
        => Task.FromResult(Preprocess(imagePath, width, height));

    // ─────────────────────────────────────────────────────────────
    private static float[] Preprocess(string imagePath, int width, int height)
    {
        if (string.IsNullOrEmpty(imagePath) || !File.Exists(imagePath))
            throw new FileNotFoundException("Image file not found for preprocessing.", imagePath);

        // Load as BGR (OpenCV default)
        using Mat src = Cv2.ImRead(imagePath, ImreadModes.Color);
        if (src.Empty())
            throw new InvalidOperationException($"OpenCV could not decode image: {imagePath}");

        // Resize → convert BGR→RGB → build NCHW float tensor
        using Mat resized = new();
        Cv2.Resize(src, resized, new Size(width, height), interpolation: InterpolationFlags.Linear);

        using Mat rgb = new();
        Cv2.CvtColor(resized, rgb, ColorConversionCodes.BGR2RGB);

        int channels = 3;
        float[] tensor = new float[channels * height * width];

        for (int c = 0; c < channels; c++)
        {
            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    Vec3b px = rgb.At<Vec3b>(y, x);
                    float raw = c switch { 0 => px.Item0, 1 => px.Item1, _ => px.Item2 };
                    tensor[c * height * width + y * width + x] =
                        (raw / 255.0f - Mean[c]) / Std[c];
                }
            }
        }

        return tensor;
    }
}
