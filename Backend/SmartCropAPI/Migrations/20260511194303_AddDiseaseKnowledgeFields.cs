using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartCropAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDiseaseKnowledgeFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Cure",
                table: "FertilizerRecommendations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prevention",
                table: "FertilizerRecommendations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Cure",
                table: "CropPredictions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Fertilizer",
                table: "CropPredictions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prevention",
                table: "CropPredictions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TopPredictionsJson",
                table: "CropPredictions",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cure",
                table: "FertilizerRecommendations");

            migrationBuilder.DropColumn(
                name: "Prevention",
                table: "FertilizerRecommendations");

            migrationBuilder.DropColumn(
                name: "Cure",
                table: "CropPredictions");

            migrationBuilder.DropColumn(
                name: "Fertilizer",
                table: "CropPredictions");

            migrationBuilder.DropColumn(
                name: "Prevention",
                table: "CropPredictions");

            migrationBuilder.DropColumn(
                name: "TopPredictionsJson",
                table: "CropPredictions");
        }
    }
}
