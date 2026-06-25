using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartCropAPI.Models;

public class User : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Phone]
    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [Required]
    public string Role { get; set; } = "User"; // Admin, Farmer, User

    // Navigation Property
    public ICollection<CropPrediction> CropPredictions { get; set; } = new List<CropPrediction>();
}
