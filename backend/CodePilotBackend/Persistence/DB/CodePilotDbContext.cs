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
  public DbSet<TaskInvocation> Invocations => Set<TaskInvocation>();

  protected override void OnModelCreating(ModelBuilder mb)
  {
    // CodingTask
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

      // NEU: 1-n zu TaskInvocation
      e.HasMany(t => t.Invocations);
    });

    // TaskInvocation
    mb.Entity<TaskInvocation>(e =>
    {
      e.ToTable("TaskInvocations");
      e.HasKey(i => i.Id);
      e.Property(i => i.Value).IsRequired();
      e.Property(i => i.Order).HasDefaultValue(0);
    });

    // User
    mb.Entity<User>(e =>
    {
      e.ToTable("Users");
      e.HasKey(u => u.Id);
      e.HasIndex(u => u.UserName).IsUnique();
      e.Property(u => u.UserName).IsRequired();
      e.Property(u => u.PasswordHash).IsRequired();
      e.Property(u => u.LearningPreferences)
        .HasColumnType("TEXT")
        .IsRequired(); 
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
