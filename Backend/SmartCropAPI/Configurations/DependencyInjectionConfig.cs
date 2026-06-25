using SmartCropAPI.Interfaces;
using SmartCropAPI.Repositories;
using SmartCropAPI.Services;

namespace SmartCropAPI.Configurations;

public static class DependencyInjectionConfig
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // AgriVision Analysis Engine
        services.AddHttpClient<IVisionAnalysisEngine, VisionAnalysisEngine>();

        // Repositories
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IFertilizerRecommendationRepository, FertilizerRecommendationRepository>();
        services.AddScoped<IDiseaseRepository, DiseaseRepository>();

        // Services
        services.AddScoped<ICropService, CropService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IFileHelperService, FileHelperService>();
        // AI Pipeline
        services.AddSingleton<ModelSessionPool>();
        services.AddScoped<IOnnxInferenceService, HierarchicalInferenceService>();
        services.AddScoped<IPredictionService, PredictionService>();
        services.AddScoped<IImagePreprocessingService, ImagePreprocessingService>();
        services.AddScoped<IFertilizerRecommendationService, FertilizerRecommendationService>();
        services.AddScoped<IDiseaseService, DiseaseService>();

        return services;
    }
}
