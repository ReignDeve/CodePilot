using CodePilot.Persistence.Db;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.DB
{
  public sealed class CodePilotDbContextFactory
    : IDesignTimeDbContextFactory<CodePilotDbContext>
  {
    public CodePilotDbContext CreateDbContext(string[] args)
    {
      var root = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "data"));
      Directory.CreateDirectory(root);

      var options = new DbContextOptionsBuilder<CodePilotDbContext>()
          .UseSqlite($"Data Source={Path.Combine(root, "codepilot.db")}")
          .Options;

      return new CodePilotDbContext(options);
    }
  }
}
