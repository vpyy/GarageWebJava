using GarageGo_BE.Models;

namespace GarageGo_BE.Services
{
    public interface IDichVuService
    {
        Task<List<DichVu>> GetAllAsync();
        Task<List<DichVu>> GetActiveAsync();
        Task<DichVu?> GetByIdAsync(int id);
        Task<bool> CreateAsync(DichVu dichVu);
        Task<bool> UpdateAsync(DichVu dichVu);
        Task<bool> DeleteAsync(int id);
    }
}
