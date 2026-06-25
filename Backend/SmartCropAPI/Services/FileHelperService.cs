using SmartCropAPI.Interfaces;

namespace SmartCropAPI.Services;

public class FileHelperService : IFileHelperService
{
    private readonly IWebHostEnvironment _environment;
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png" };
    private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

    public FileHelperService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> SaveImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("No file was uploaded.");

        if (file.Length > MaxFileSize)
            throw new ArgumentException($"File size exceeds the {MaxFileSize / (1024 * 1024)} MB limit.");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(extension) || !_allowedExtensions.Contains(extension))
            throw new ArgumentException("Invalid file type. Only JPG, JPEG, and PNG are allowed.");

        var uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var sanitizedFileName = Path.GetFileNameWithoutExtension(file.FileName).Replace(" ", "_").ToLower();
        var uniqueFileName = $"{Guid.NewGuid()}_{sanitizedFileName}{extension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Return relative path to be saved in DB
        return $"/uploads/{uniqueFileName}";
    }
}
