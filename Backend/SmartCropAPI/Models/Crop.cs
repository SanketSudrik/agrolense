namespace SmartCropAPI.Models;

public class Crop : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IdealSeason { get; set; } = string.Empty;
    public int DaysToHarvest { get; set; }
}
