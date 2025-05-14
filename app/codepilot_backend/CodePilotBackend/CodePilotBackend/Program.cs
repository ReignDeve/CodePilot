using Application.DependencyInjection;
using CodePilot.Backend.WebAPI;
using CodePilot.Persistence.Db;
using Microsoft.EntityFrameworkCore;
using Persistence.DependencyInjection;



var builder = WebApplication.CreateBuilder(args);


var dataDir = Path.Combine(builder.Environment.ContentRootPath, "data");
Directory.CreateDirectory(dataDir);

// Add services to the container.
builder.Services.AddCors(options =>
{
  options.AddDefaultPolicy(policy =>
  {
    policy
        .AllowAnyOrigin()    // oder: .WithOrigins("https://dein-frontend-domain.com")
        .AllowAnyMethod()    // POST, GET, OPTIONS, etc.
        .AllowAnyHeader();   // Content-Type, Authorization, ...
  });
});

// Semantic-Kernel + ExplainService registrieren
builder.Services.AddDbContext<CodePilotDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddPersistence(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);
builder.Services.AddControllers();

builder.Services.AddHostedService<SeedRunner>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors();

app.MapControllers();

app.Run();

