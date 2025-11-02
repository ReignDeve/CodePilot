using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
  public class User
  {
    public Guid Id { get; init; } = Guid.NewGuid();
    public string UserName { get; private set; } = "";
    public string PasswordHash { get; private set; } = "";
    public string LearningPreferences { get; private set; } = "";

    public static User Create(string name) => new() { UserName = name };

    public void SetPassword(string newPassword, IPasswordHasher<User> hasher)
    {
      PasswordHash = hasher.HashPassword(this, newPassword);
    }

    public bool ValidatePassword(string password, IPasswordHasher<User> hasher)
    {
      var result = hasher.VerifyHashedPassword(this, PasswordHash, password);
      return result != PasswordVerificationResult.Failed;
    }

    public void SetLearningPreferences(string text) => LearningPreferences = text ?? "";
  }
}
