using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GarageGo_BE.Data;
using GarageGo_BE.Models;

namespace GarageGo_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanPhamController : ControllerBase
    {
        private readonly GarageDbContext _context;

        public SanPhamController(GarageDbContext context)
        {
            _context = context;
        }

        // GET: api/SanPham
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetSanPhams()
        {
            var sanPhams = await _context.SanPhams.ToListAsync();
            var result = sanPhams.Select(s => new
            {
                maSP = s.Id,
                tenSP = s.TenSanPham,
                donGia = s.Gia,
                moTa = s.MoTa,
                hinhAnh = s.HinhAnh,
                soLuongTon = s.SoLuongTon,
                donVi = s.DonVi
            });
            return Ok(result);
        }

        // GET: api/SanPham/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetSanPham(int id)
        {
            var sanPham = await _context.SanPhams.FindAsync(id);

            if (sanPham == null)
                return NotFound();

            var result = new
            {
                maSP = sanPham.Id,
                tenSP = sanPham.TenSanPham,
                donGia = sanPham.Gia,
                moTa = sanPham.MoTa,
                hinhAnh = sanPham.HinhAnh,
                soLuongTon = sanPham.SoLuongTon,
                donVi = sanPham.DonVi
            };

            return Ok(result);
        }

        // GET: api/SanPham/InStock
        [HttpGet("InStock")]
        public async Task<ActionResult<IEnumerable<SanPham>>> GetInStockSanPhams()
        {
            return await _context.SanPhams
                .Where(s => s.SoLuongTon > 0)
                .ToListAsync();
        }

        // POST: api/SanPham
        [HttpPost]
        public async Task<ActionResult<SanPham>> PostSanPham(SanPham sanPham)
        {
            _context.SanPhams.Add(sanPham);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSanPham), new { id = sanPham.Id }, sanPham);
        }

        // PUT: api/SanPham/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSanPham(int id, SanPham sanPham)
        {
            if (id != sanPham.Id)
                return BadRequest();

            _context.Entry(sanPham).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SanPhamExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/SanPham/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSanPham(int id)
        {
            var sanPham = await _context.SanPhams.FindAsync(id);
            if (sanPham == null)
                return NotFound();

            _context.SanPhams.Remove(sanPham);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SanPhamExists(int id)
        {
            return _context.SanPhams.Any(e => e.Id == id);
        }
    }
}
