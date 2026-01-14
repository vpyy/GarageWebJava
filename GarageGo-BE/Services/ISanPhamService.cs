using GarageGo_BE.Models;

namespace GarageGo_BE.Services
{
    public interface ISanPhamService
    {
        Task<List<SanPham>> GetAllAsync();
        Task<List<SanPham>> GetInStockAsync();
        Task<SanPham?> GetByIdAsync(int id);
        Task<bool> CreateAsync(SanPham sanPham);
        Task<bool> UpdateAsync(SanPham sanPham);
        Task<bool> DeleteAsync(int id);
    }
}
