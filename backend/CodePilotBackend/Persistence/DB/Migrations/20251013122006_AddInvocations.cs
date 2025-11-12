using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Db.Migrations
{
    /// <inheritdoc />
    public partial class AddInvocations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Invocations",
                table: "Tasks",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Invocations",
                table: "Tasks");
        }
    }
}
