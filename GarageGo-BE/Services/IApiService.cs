using GarageGo_BE.Models;

namespace GaraWeb.Services
{
    public interface IApiService
    {
        Task<List<DichVu>> GetDichVusAsync();
        Task<List<SanPham>> GetSanPhamsAsync();
        Task<SanPham> GetSanPhamByIdAsync(int id);
        Task<bool> CreateYeucauDichVuAsync(YeucauDichVu yeucau);
    }
}
