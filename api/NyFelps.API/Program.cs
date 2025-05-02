using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Cryptography;
using System.Security.Claims;
using NyFelps.API.Data;
using NyFelps.API.Models;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>();

var jwtKey = Encoding.ASCII.GetBytes("sua-chave-secreta-com-pelo-menos-32-caracteres");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata    = false;
    options.SaveToken               = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey         = new SymmetricSecurityKey(jwtKey),
        ValidateIssuer           = false,
        ValidateAudience         = false,
    };
});

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapPost("/api/auth/register", async (AppDbContext db, RegisterDto dto) =>
{
    // Verifica se o e-mail já existe
     if (await db.Usuarios.AnyAsync(u => u.Email == dto.Email))
     return Results.BadRequest("E-mail já cadastrado.");

    // Criptografa a senha (simplesmente para exemplo; use um hash forte na prática)
    var usuario = new Usuario
    {
        Nome      = dto.Nome,
        Email     = dto.Email,
        SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha)
    };

    db.Usuarios.Add(usuario);
    await db.SaveChangesAsync();

    return Results.Created($"/api/auth/register/{usuario.Id}", new { usuario.Id, usuario.Email });
});

app.MapPost("/api/auth/login", async (AppDbContext db, LoginDto dto) =>
{
    var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);
    if (usuario is null)
        return Results.Unauthorized();

    bool senhaValida = BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash);
    if (!senhaValida)
        return Results.Unauthorized();

    // Geração do token
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
        new Claim(ClaimTypes.Email, usuario.Email),
    };

    var chave = new SymmetricSecurityKey(jwtKey);
    var credenciais = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256);

    var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.AddHours(2),
        signingCredentials: credenciais
    );

    var tokenString = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);

    return Results.Ok(new { token = tokenString });
});



// Endpoints da API (exemplo para Jogos)
app.MapGet("/api/jogo", async (AppDbContext context) => 
    await context.Jogos.Include(j => j.Categoria).ToListAsync());

app.MapPost("/api/jogo", async (AppDbContext context, Jogo jogo) => 
{
    context.Jogos.Add(jogo);
    await context.SaveChangesAsync();
    return Results.Created($"/api/jogo/{jogo.Id}", jogo);
});

// GET: Listar todas as categorias
app.MapGet("/api/categoria", async (AppDbContext context) => 
    await context.Categorias.ToListAsync());

// POST: Criar uma nova categoria
app.MapPost("/api/categoria", async (AppDbContext context, Categoria categoria) => 
{
    context.Categorias.Add(categoria);
    await context.SaveChangesAsync();
    return Results.Created($"/api/categoria/{categoria.Id}", categoria);
});

app.MapGet("/api/debug/users", async (AppDbContext db) =>
    await db.Usuarios
            .Select(u => new { u.Id, u.Email })
            .ToListAsync()
);

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})

.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();


record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
