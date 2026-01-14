using GarageGo_BE.Models;

namespace GarageGo_BE.Services
{
    public interface IYeucauService
    {
        Task<List<YeucauDichVu>> GetAllAsync();
        Task<YeucauDichVu?> GetByIdAsync(int id);
        Task<bool> UpdateStatusAsync(int id, string trangThai);
        Task<bool> DeleteAsync(int id);
    }
}

