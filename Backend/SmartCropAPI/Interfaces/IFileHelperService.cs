namespace SmartCropAPI.Interfaces;

public interface IFileHelperService
{
    Task<string> SaveImageAsync(IFormFile file);
}
