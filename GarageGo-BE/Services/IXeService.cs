using GarageGo_BE.Models;

namespace GarageGo_BE.Services
{
    public interface IXeService
    {
        Task<List<Xe>> GetAllAsync();
        Task<Xe?> GetByIdAsync(int id);
        Task<List<Xe>> GetByKhachHangAsync(int maKH);
        Task<Xe?> GetByBienSoAsync(string bienSo);
        Task<bool> CreateAsync(Xe xe);
        Task<bool> UpdateAsync(Xe xe);
        Task<bool> DeleteAsync(int id);
    }
}
