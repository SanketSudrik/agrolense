using SmartCropAPI.Models;

namespace SmartCropAPI.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> UserExistsAsync(string email);
}
