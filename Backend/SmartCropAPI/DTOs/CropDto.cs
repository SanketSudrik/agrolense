using System.ComponentModel.DataAnnotations;

namespace SmartCropAPI.DTOs;

public class CropDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IdealSeason { get; set; } = string.Empty;
    public int DaysToHarvest { get; set; }
}

public class CreateCropDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string IdealSeason { get; set; } = string.Empty;

    [Required]
    [Range(1, 365, ErrorMessage = "Days to harvest must be between 1 and 365")]
    public int DaysToHarvest { get; set; }
}
