using Microsoft.EntityFrameworkCore;
using SmartCropAPI.Data;
using SmartCropAPI.Interfaces;
using SmartCropAPI.Models;

namespace SmartCropAPI.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var normalizedEmail = email?.ToLower();
        return await _context.Set<User>().FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
    }

    public async Task<bool> UserExistsAsync(string email)
    {
        var normalizedEmail = email?.ToLower();
        return await _context.Set<User>().AnyAsync(u => u.Email.ToLower() == normalizedEmail);
    }
}
