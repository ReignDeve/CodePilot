using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CodePilot.Persistence.Db;
public class CodePilotDbContext : DbContext
{
  public CodePilotDbContext(DbContextOptions<CodePilotDbContext> options)
      : base(options) { }

  public DbSet<CodingTask> Tasks => Set<CodingTask>();
  public DbSet<User> Users => Set<User>();
  public DbSet<UserTaskProgress> UserTaskProgress => Set<UserTaskProgress>();

  protected override void OnModelCreating(ModelBuilder mb)
  {
    // bestehende Task-Mapping…
    mb.Entity<CodingTask>(e =>
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

    // User
    mb.Entity<User>(e =>
    {
      e.ToTable("Users");
      e.HasKey(u => u.Id);
      e.HasIndex(u => u.UserName).IsUnique();
      e.Property(u => u.UserName).IsRequired();
      e.Property(u => u.PasswordHash).IsRequired();
    });

    // Progress
    mb.Entity<UserTaskProgress>(e =>
    {
      e.ToTable("UserTaskProgress");
      e.HasKey(utp => utp.Id);
      e.HasIndex(utp => new { utp.UserId, utp.TaskId }).IsUnique();
      e.Property(utp => utp.Status).HasConversion<string>().IsRequired();
    });
  }
}
