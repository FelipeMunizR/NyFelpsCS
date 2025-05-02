// Models/Jogo.cs
using System.ComponentModel.DataAnnotations;

namespace NyFelps.API.Models;

public class Jogo
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Título obrigatório!")]
    public string Titulo { get; set; } = string.Empty;

    [Required(ErrorMessage = "Descrição obrigatória!")]
    public string Descricao { get; set; } = string.Empty;

    public string ImagemUrl { get; set; } = string.Empty;
    public bool Favorito { get; set; }

    // Relação com Categoria (1:N)
    public int CategoriaId { get; set; }
    public Categoria? Categoria { get; set; }
}