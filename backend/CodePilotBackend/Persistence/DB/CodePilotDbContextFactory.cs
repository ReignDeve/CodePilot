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
      // 1. Auf Azure ist die Variable "HOME" (Windows: USERPROFILE) gesetzt
      var homeDir = Environment.GetEnvironmentVariable("HOME")
                 ?? Environment.GetEnvironmentVariable("USERPROFILE");

      // 2. Wenn vorhanden → in ~/data/codepilot.db schreiben
      //    sonst (lokal) weiter in ../data/codepilot.db
      string root;

      if (!string.IsNullOrEmpty(homeDir))
      {
        root = Path.Combine(homeDir, "data");            // Azure-Pfad: D:\home\data
      }
      else
      {
        root = Path.GetFullPath(Path.Combine(
                 Directory.GetCurrentDirectory(), "..", "data")); // lokaler Pfad
      }

      Directory.CreateDirectory(root);                      // Ordner sicherstellen

      var dbPath = Path.Combine(root, "codepilot.db");
      var options = new DbContextOptionsBuilder<CodePilotDbContext>()
          .UseSqlite($"Data Source={dbPath}")
          .Options;

      return new CodePilotDbContext(options);
    }
  }
}
