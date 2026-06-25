using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCropAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddPlantNameAndDamagePercentage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "DamagePercentage",
                table: "CropPredictions",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "PlantName",
                table: "CropPredictions",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DamagePercentage",
                table: "CropPredictions");

            migrationBuilder.DropColumn(
                name: "PlantName",
                table: "CropPredictions");
        }
    }
}
