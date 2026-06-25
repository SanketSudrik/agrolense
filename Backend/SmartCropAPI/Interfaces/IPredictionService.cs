using SmartCropAPI.DTOs;
using SmartCropAPI.Models;

namespace SmartCropAPI.Interfaces;

public interface IPredictionService
{
    Task<PredictionResponse> PredictAndSaveAsync(int? userId, string imagePath, string language = "English");
    Task<IEnumerable<PredictionResponse>> GetUserPredictionHistoryAsync(int userId);
    Task<IEnumerable<PredictionResponse>> GetAllPredictionHistoryAsync();
}
