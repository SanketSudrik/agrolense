using System.ComponentModel.DataAnnotations;

namespace SmartCropAPI.Models;

public class Disease : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    public string Symptoms { get; set; } = string.Empty;

    public string Treatment { get; set; } = string.Empty;

    [MaxLength(100)]
    public string AffectedCrop { get; set; } = string.Empty;

    [MaxLength(100)]
    public string ScientificName { get; set; } = string.Empty;

    public string Causes { get; set; } = string.Empty;

    public string Prevention { get; set; } = string.Empty;

    public string Fertilizer { get; set; } = string.Empty;
}
