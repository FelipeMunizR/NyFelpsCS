using Microsoft.EntityFrameworkCore;
using NyFelps.API.Models; // Certifique-se de que este namespace está correto!

namespace NyFelps.API.Data; // Namespace da pasta Data

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

    // Representa a tabela "Jogos" no banco de dados
    public DbSet<Jogo> Jogos { get; set; }

    // Representa a tabela "Categorias" no banco de dados
    public DbSet<Categoria> Categorias { get; set; }

    public DbSet<Usuario> Usuarios { get; set; }

    // Configura o SQLite como banco de dados
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=nyfelps.db"); // Nome do arquivo do banco
    }
}