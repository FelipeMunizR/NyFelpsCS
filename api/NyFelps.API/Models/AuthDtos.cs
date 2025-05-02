namespace NyFelps.API.Models
{
    public class RegisterDto
    {
        public string Nome { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Senha { get; set; } = null!;
    }

    public class LoginDto
    {
        public string Email { get; set; } = null!;
        public string Senha { get; set; } = null!;
    }
}
