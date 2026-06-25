using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCropAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDescriptionToCropPrediction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "CropPredictions",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "CropPredictions");
        }
    }
}
