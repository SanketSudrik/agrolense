using BCrypt.Net;

namespace SmartCropAPI.Helpers;

public static class PasswordHasher
{
    public static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public static bool VerifyPassword(string password, string hashedPassword)
    {
        try
        {
            if (string.IsNullOrEmpty(hashedPassword) || !hashedPassword.StartsWith("$2"))
            {
                // Fallback for manually inserted plaintext passwords (common in development)
                return password == hashedPassword;
            }
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
        catch (Exception)
        {
            return false;
        }
    }
}
