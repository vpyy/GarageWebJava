using GarageGo_BE.Models;

namespace GarageGo_BE.Services
{
    public interface IAuthService
    {
        Task<User?> LoginAsync(string username, string password);
    }
}
