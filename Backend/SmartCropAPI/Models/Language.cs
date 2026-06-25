using System.ComponentModel.DataAnnotations;

namespace SmartCropAPI.Models;

public class Language : BaseEntity
{
    [Required]
    [MaxLength(10)]
    public string Code { get; set; } = string.Empty; // e.g., "en", "hi", "mr"

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty; // e.g., "English", "Hindi", "Marathi"

    public bool IsActive { get; set; } = true;
}
