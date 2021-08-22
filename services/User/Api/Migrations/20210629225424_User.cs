using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace User.Api.Migrations {
  public partial class User : Migration {
    protected override void Up(MigrationBuilder migrationBuilder) {
      migrationBuilder.AlterDatabase()
          .Annotation("MySql:CharSet", "utf8mb4");

      migrationBuilder.CreateTable(
          name: "Users",
          columns: table => new {
            Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
            FirstName = table.Column<string>(type: "longtext", nullable: true)
                  .Annotation("MySql:CharSet", "utf8mb4"),
            LastName = table.Column<string>(type: "longtext", nullable: true)
                  .Annotation("MySql:CharSet", "utf8mb4"),
            Email = table.Column<string>(type: "longtext", nullable: true)
                  .Annotation("MySql:CharSet", "utf8mb4"),
            Status = table.Column<int>(type: "int", nullable: false),
            DateCreated = table.Column<DateTime>(type: "datetime(6)", nullable: false)
          },
          constraints: table => {
            table.PrimaryKey("PK_Users", x => x.Id);
          })
          .Annotation("MySql:CharSet", "utf8mb4");

      migrationBuilder.CreateIndex(
          name: "IX_Users_Id",
          table: "Users",
          column: "Id");
    }

    protected override void Down(MigrationBuilder migrationBuilder) {
      migrationBuilder.DropTable(
          name: "Users");
    }
  }
}
