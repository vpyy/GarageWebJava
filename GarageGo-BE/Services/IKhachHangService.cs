using GarageGo_BE.Models;

namespace GarageGo_BE.Services
{
    public interface IKhachHangService
    {
        Task<List<KhachHang>> GetAllAsync();
        Task<KhachHang?> GetByIdAsync(int id);
        Task<KhachHang?> GetBySDTAsync(string sdt);
        Task<bool> CreateAsync(KhachHang khachHang);
        Task<bool> UpdateAsync(KhachHang khachHang);
        Task<bool> DeleteAsync(int id);
    }
}
