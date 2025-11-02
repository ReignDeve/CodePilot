using Application.DependencyInjection;
using CodePilot.Backend.WebAPI;
using CodePilot.Persistence.Db;
using Domain.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Persistence.DependencyInjection;
using System.Text;



var builder = WebApplication.CreateBuilder(args);

// ---------- 1. SQLite-Pfad dynamisch festlegen ----------
string dbPath;
var home = Environment.GetEnvironmentVariable("HOME")   // Linux App Service
        ?? Environment.GetEnvironmentVariable("USERPROFILE"); // Windows

if (!string.IsNullOrEmpty(home))
{
  dbPath = Path.Combine(home, "data", "codepilot.db");   // Azure-Pfad
}
else
{
  dbPath = Path.Combine(builder.Environment.ContentRootPath, "data", "codepilot.db"); // lokal
}
Directory.CreateDirectory(Path.GetDirectoryName(dbPath)!);

// ---------- 2. Services ----------
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowFrontend", p =>
      p.WithOrigins("https://delightful-river-0f14c5103.3.azurestaticapps.net", "http://localhost:5173") // ← ohne Slash
       .AllowAnyHeader()
       .AllowAnyMethod());
});

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

builder.Services.AddDbContext<CodePilotDbContext>(opt =>
    opt.UseSqlite($"Data Source={dbPath}"));

builder.Services.AddPersistence(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);   // ← nur einmal
builder.Services.AddControllers();
//builder.Services.AddHostedService<SeedRunner>();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1", new OpenApiInfo
  {
    Title = "JWTToken_Auth_API",
    Version = "v1"
  });
  c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
  {
    Name = "Authorization",
    Type = SecuritySchemeType.ApiKey,
    Scheme = "Bearer",
    BearerFormat = "JWT",
    In = ParameterLocation.Header,
    Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
  });
  c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
builder.Services.AddAuthentication(o =>
{
  o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opts =>
{
  opts.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true, 
    ClockSkew = TimeSpan.Zero,       
    ValidIssuer = builder.Configuration["Jwt:Issuer"],
    ValidAudience = builder.Configuration["Jwt:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(
      Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
  };
});


var app = builder.Build();



using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<CodePilotDbContext>();
  db.Database.Migrate();
}
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseRouting();                    
app.UseCors("AllowFrontend");        
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

