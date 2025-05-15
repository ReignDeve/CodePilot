using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CodePilot.Persistence.Db;
public class CodePilotDbContext : DbContext
{
  public CodePilotDbContext(DbContextOptions<CodePilotDbContext> options)
      : base(options) { }

  public DbSet<CodingTask> Tasks => Set<CodingTask>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<CodingTask>(e =>
    {
      e.ToTable("Tasks");
      e.HasKey(t => t.Id);
      e.Property(t => t.Status).HasConversion<string>();
      e.Property(t => t.Difficulty).HasConversion<string>();
      e.Property(t => t.Title).IsRequired();
      e.Property(t => t.Code).IsRequired();
      e.Property(t => t.Description);
      e.Property(t => t.Solution);
    });
  }
}
