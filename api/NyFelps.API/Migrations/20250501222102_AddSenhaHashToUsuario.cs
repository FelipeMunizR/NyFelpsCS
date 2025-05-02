using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NyFelps.API.Migrations
{
    /// <inheritdoc />
    public partial class AddSenhaHashToUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "Usuarios",
                newName: "SenhaHash");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SenhaHash",
                table: "Usuarios",
                newName: "PasswordHash");
        }
    }
}
