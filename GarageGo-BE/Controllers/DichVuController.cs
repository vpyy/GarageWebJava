using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GarageGo_BE.Data;
using GarageGo_BE.Models;

namespace GarageGo_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DichVuController : ControllerBase
    {
        private readonly GarageDbContext _context;

        public DichVuController(GarageDbContext context)
        {
            _context = context;
        }

        // GET: api/DichVu
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDichVus()
        {
            var dichVus = await _context.DichVus.ToListAsync();
            var result = dichVus.Select(d => new
            {
                maDV = d.Id,
                tenDV = d.TenDichVu,
                donGia = d.Gia,
                moTa = d.MoTa,
                hinhAnh = d.HinhAnh,
                trangThai = d.TrangThai
            });
            return Ok(result);
        }

        // GET: api/DichVu/Active
        [HttpGet("Active")]
        public async Task<ActionResult<IEnumerable<DichVu>>> GetActiveDichVus()
        {
            return await _context.DichVus
                .Where(d => d.TrangThai)
                .ToListAsync();
        }

        // GET: api/DichVu/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetDichVu(int id)
        {
            var dichVu = await _context.DichVus.FindAsync(id);

            if (dichVu == null)
                return NotFound();

            var result = new
            {
                maDV = dichVu.Id,
                tenDV = dichVu.TenDichVu,
                donGia = dichVu.Gia,
                moTa = dichVu.MoTa,
                hinhAnh = dichVu.HinhAnh,
                trangThai = dichVu.TrangThai
            };

            return Ok(result);
        }

        // POST: api/DichVu
        [HttpPost]
        public async Task<ActionResult<DichVu>> PostDichVu(DichVu dichVu)
        {
            _context.DichVus.Add(dichVu);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDichVu), new { id = dichVu.Id }, dichVu);
        }

        // PUT: api/DichVu/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDichVu(int id, DichVu dichVu)
        {
            if (id != dichVu.Id)
                return BadRequest();

            _context.Entry(dichVu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DichVuExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/DichVu/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDichVu(int id)
        {
            var dichVu = await _context.DichVus.FindAsync(id);
            if (dichVu == null)
                return NotFound();

            _context.DichVus.Remove(dichVu);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DichVuExists(int id)
        {
            return _context.DichVus.Any(e => e.Id == id);
        }
    }
}
