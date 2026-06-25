using Microsoft.EntityFrameworkCore;
using SmartCropAPI.Models;

namespace SmartCropAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Crop> Crops { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<CropPrediction> CropPredictions { get; set; }
    public DbSet<FertilizerRecommendation> FertilizerRecommendations { get; set; }
    public DbSet<Disease> Diseases { get; set; }
    public DbSet<Language> Languages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Crop>().Property(c => c.Name).IsRequired().HasMaxLength(100);
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique(); // Ensure emails are unique
    }
}
