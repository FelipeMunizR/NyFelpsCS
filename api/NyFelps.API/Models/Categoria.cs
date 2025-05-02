// Models/Categoria.cs
using System.ComponentModel.DataAnnotations;

namespace NyFelps.API.Models;

public class Categoria
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Nome da categoria obrigatório!")]
    public string Nome { get; set; } = string.Empty;
}