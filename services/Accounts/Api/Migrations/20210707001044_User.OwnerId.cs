using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Accounts.Api.Migrations {
  public partial class UserOwnerId : Migration {
    protected override void Up(MigrationBuilder migrationBuilder) {
      migrationBuilder.AddColumn<Guid>(
          name: "OwnerId",
          table: "Accounts",
          type: "char(36)",
          nullable: false,
          defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
          collation: "ascii_general_ci");
    }

    protected override void Down(MigrationBuilder migrationBuilder) {
      migrationBuilder.DropColumn(
          name: "OwnerId",
          table: "Accounts");
    }
  }
}
