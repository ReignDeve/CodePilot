var builder = WebApplication.CreateBuilder(args);

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


builder.Services.AddControllers();
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
