using GarageGo_BE.Models;
using GarageGo_BE.DTOs;

namespace GarageGo_BE.Services
{
    public interface IHoaDonService
    {
        Task<List<HoaDon>> GetAllAsync();
        Task<HoaDon?> GetByIdAsync(int id);
        Task<bool> CreateAsync(HoaDonCreateDto viewModel);
        Task<bool> CompleteAsync(int id);
        Task<bool> DeleteAsync(int id);
    }
}
