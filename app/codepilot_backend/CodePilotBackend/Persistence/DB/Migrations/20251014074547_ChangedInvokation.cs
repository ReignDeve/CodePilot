using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Db.Migrations
{
    /// <inheritdoc />
    public partial class ChangedInvokation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TaskInvocations_CodingTaskId_Order",
                table: "TaskInvocations");

            migrationBuilder.CreateIndex(
                name: "IX_TaskInvocations_CodingTaskId",
                table: "TaskInvocations",
                column: "CodingTaskId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TaskInvocations_CodingTaskId",
                table: "TaskInvocations");

            migrationBuilder.CreateIndex(
                name: "IX_TaskInvocations_CodingTaskId_Order",
                table: "TaskInvocations",
                columns: new[] { "CodingTaskId", "Order" });
        }
    }
}
