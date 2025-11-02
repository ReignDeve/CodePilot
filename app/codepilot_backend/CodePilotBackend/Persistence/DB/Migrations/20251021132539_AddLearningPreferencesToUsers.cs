using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Db.Migrations
{
    /// <inheritdoc />
    public partial class AddLearningPreferencesToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LearningPreferences",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LearningPreferences",
                table: "Users");
        }
    }
}
