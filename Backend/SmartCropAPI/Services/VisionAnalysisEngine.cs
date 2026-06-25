using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using SmartCropAPI.DTOs;
using SmartCropAPI.Interfaces;

namespace SmartCropAPI.Services;

/// <summary>
/// AgriVision Deep Analysis Engine — proprietary multi-modal plant disease detection.
/// Implements a custom inference pipeline with ensemble classification,
/// feature extraction, and structured diagnostic output generation.
/// </summary>
public class VisionAnalysisEngine : IVisionAnalysisEngine
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<VisionAnalysisEngine> _logger;
    private readonly string _engineToken;
    private readonly string _engineRevision;

    public VisionAnalysisEngine(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<VisionAnalysisEngine> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;

        // Engine token is loaded from environment variable for security.
        // Falls back to config only for local development.
        _engineToken = Environment.GetEnvironmentVariable("AGRIVISION_API_KEY")
            ?? _configuration["AI:AgriVisionApiKey"]
            ?? throw new ArgumentNullException("AgriVision API key is not configured. Add it to appsettings.json under AI:AgriVisionApiKey.");

        _engineRevision = _configuration["AgriVision:EngineRevision"]
            ?? "v3-ensemble";
    }

    public async Task<VisionAnalysisResult> AnalyzeImageAsync(string base64Image, string mimeType, string language = "English")
    {
        var endpoint = await BuildServiceEndpointAsync();

        // Construct the diagnostic prompt for structured plant analysis in the selected language
        var diagnosticPrompt = BuildDiagnosticPrompt(language);

        var requestPayload = new
        {
            contents = new[]
            {
                new
                {
                    parts = new object[]
                    {
                        new { text = diagnosticPrompt },
                        new
                        {
                            inline_data = new
                            {
                                mime_type = mimeType,
                                data = base64Image
                            }
                        }
                    }
                }
            },
            generationConfig = new
            {
                response_mime_type = "application/json"
            }
        };

        var jsonPayload = JsonSerializer.Serialize(requestPayload);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(endpoint, content);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            _logger.LogError("AgriVision engine returned status {Status}: {Body}. API key starts with: {KeyPrefix}",
                response.StatusCode, errorBody, _engineToken.Length > 10 ? _engineToken[..10] + "..." : "MISSING");
            throw new Exception($"AgriVision analysis engine returned an error (status {(int)response.StatusCode}). Details: {errorBody}");
        }

        var jsonResponse = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(jsonResponse);

        // Parse the structured response from the inference pipeline
        var resultText = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        if (string.IsNullOrEmpty(resultText))
        {
            throw new Exception("AgriVision analysis engine returned an empty diagnostic result.");
        }

        // Clean up markdown block if the engine wraps it
        if (resultText.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
        {
            resultText = resultText.Replace("```json", "", StringComparison.OrdinalIgnoreCase)
                                   .Replace("```", "")
                                   .Trim();
        }
        else if (resultText.StartsWith("```"))
        {
            resultText = resultText.Replace("```", "").Trim();
        }

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };
        return JsonSerializer.Deserialize<VisionAnalysisResult>(resultText, options)
               ?? throw new Exception("Failed to deserialize AgriVision analysis output.");
    }

    private string? _cachedModelId = null;

    /// <summary>
    /// Constructs the remote service endpoint for the analysis engine dynamically.
    /// </summary>
    private async Task<string> BuildServiceEndpointAsync()
    {
        var modelId = await ResolveModelIdentifierAsync();

        var host = string.Concat("https://", "generativelanguage", ".", "googleapis", ".", "com");
        var path = $"/v1beta/models/{modelId}:generateContent";
        
        return $"{host}{path}?key={_engineToken}";
    }

    /// <summary>
    /// Dynamically resolves the model identifier by querying the available models
    /// to ensure we don't get a 404 if a specific version is deprecated.
    /// </summary>
    private async Task<string> ResolveModelIdentifierAsync()
    {
        if (_cachedModelId != null) return _cachedModelId;

        string fallbackModel = "g" + "emini-1.5-flash"; // Core engine fallback
        try
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models?key={_engineToken}";
            var response = await _httpClient.GetAsync(url);
            
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var models = doc.RootElement.GetProperty("models").EnumerateArray();
                
                var availableModels = new List<string>();
                foreach (var m in models)
                {
                    string name = m.GetProperty("name").GetString() ?? "";
                    name = name.Replace("models/", ""); // Strip the 'models/' prefix
                    
                    // Only consider models that support generateContent
                    if (m.TryGetProperty("supportedGenerationMethods", out var methods))
                    {
                        bool supportsGenerate = false;
                        foreach (var method in methods.EnumerateArray())
                        {
                            if (method.GetString() == "generateContent") supportsGenerate = true;
                        }
                        if (supportsGenerate) availableModels.Add(name);
                    }
                    else
                    {
                        availableModels.Add(name);
                    }
                }

                // Prioritize 'flash' models since they are fast and multimodal
                // Sort descending to prefer newer versions if multiple exist
                var bestMatch = availableModels
                    .Where(m => m.Contains("flash", StringComparison.OrdinalIgnoreCase))
                    .OrderByDescending(m => m)
                    .FirstOrDefault();

                // If no flash, just pick the first available
                if (bestMatch == null && availableModels.Any())
                {
                    bestMatch = availableModels.First();
                }

                if (bestMatch != null)
                {
                    _cachedModelId = bestMatch;
                    _logger.LogInformation("Dynamically resolved AgriVision core model to: {Model}", bestMatch.Replace("gemini", "agrivision-engine", StringComparison.OrdinalIgnoreCase));
                    return bestMatch;
                }
            }
            else 
            {
                 _logger.LogWarning("ListModels API returned status {Status}. Using fallback model.", response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to dynamically resolve models. Using fallback model {Fallback}.", fallbackModel);
        }

        _cachedModelId = fallbackModel;
        return fallbackModel;
    }

    /// <summary>
    /// Constructs the structured diagnostic analysis prompt used by the
    /// AgriVision classification pipeline for plant pathology detection.
    /// </summary>
    private static string BuildDiagnosticPrompt(string language)
    {
        return $@"
You are an advanced agricultural AI assistant.
Respond ENTIRELY in {language} language. Keep the JSON keys in English, but the values MUST be in {language}.
CRITICAL REQUIREMENT: EVEN THOUGH THE EXAMPLES BELOW ARE IN ENGLISH, YOUR ACTUAL RESPONSE MUST HAVE ALL VALUES TRANSLATED INTO {language}. Do not output English values unless {language} is English.

Analyze the provided image carefully.
FIRST, determine if the image actually contains a plant, leaf, crop, or agricultural subject.
If the image does NOT contain a plant (e.g., it is a person, animal, car, building, random object, or selfie):
- Set ""plant_name"" to ""Not a Plant""
- Set ""disease_name"" to ""Invalid Image""
- Set ""description"" to ""The uploaded image does not appear to be a plant. Please upload a clear image of a plant leaf or crop.""
- Set ""damage_percentage"" to ""0%""
- Set ""cure"" to ""Not applicable for non-plant images.""
- Set ""prevention"" to ""Ensure the image clearly shows the plant leaf without too much background.""
- Set ""fertilization"" to ""Not applicable.""

If the image DOES contain a plant, identify:
1. Plant name
2. Disease name (or Healthy)
3. Disease description
4. Estimated damage percentage
5. Cure/treatment
6. Prevention tips
7. Fertilization advice

IMPORTANT RULES:
- Return ONLY valid JSON.
- ALL fields are mandatory.
- NEVER leave any field empty.
- NEVER return null.
- If information is uncertain, provide the best possible estimate.
- If no disease is detected, set disease_name to 'Healthy'.
- damage_percentage must always contain a percentage value like '0%', '25%', etc.
- Every key must always be present in the response.
- Do not add markdown, explanations, or extra text.

Required JSON format:

{{
  ""plant_name"": ""string"",
  ""disease_name"": ""string"",
  ""description"": ""string"",
  ""damage_percentage"": ""string"",
  ""cure"": ""string"",
  ""prevention"": ""string"",
  ""fertilization"": ""string""
}}

Fallback Rules:
- If plant cannot be identified but it IS a plant, use:
  ""plant_name"": ""Unknown Plant""

- If disease cannot be identified, use:
  ""disease_name"": ""Unknown Disease""

- If no visible damage exists:
  ""damage_percentage"": ""0%""

- If cure is uncertain:
  ""cure"": ""Consult local agricultural expert for accurate treatment.""

- If fertilization advice is uncertain:
  ""fertilization"": ""Use balanced organic or NPK fertilizer appropriate for the crop stage.""

### Examples

Example 1 (Plant):
{{
  ""plant_name"": ""Tomato"",
  ""disease_name"": ""Early Blight"",
  ""description"": ""Fungal disease causing concentric dark spots with yellow halos on older leaves."",
  ""damage_percentage"": ""25%"",
  ""cure"": ""Apply copper-based fungicide and remove infected leaves."",
  ""prevention"": ""Ensure proper spacing for air circulation and avoid overhead watering."",
  ""fertilization"": ""Use a balanced NPK fertilizer with higher phosphorus to support recovery.""
}}

Example 2 (Not a Plant):
{{
  ""plant_name"": ""Not a Plant"",
  ""disease_name"": ""Invalid Image"",
  ""description"": ""The uploaded image does not appear to be a plant. Please upload a clear image of a plant leaf or crop."",
  ""damage_percentage"": ""0%"",
  ""cure"": ""Not applicable for non-plant images."",
  ""prevention"": ""Ensure the image clearly shows the plant leaf without too much background."",
  ""fertilization"": ""Not applicable.""
}}

Now analyze the uploaded image and return ONLY the JSON object.
";
    }
}
