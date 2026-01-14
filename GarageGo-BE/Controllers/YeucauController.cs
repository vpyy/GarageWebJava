using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GarageGo_BE.Data;
using GarageGo_BE.Models;

namespace GarageGo_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YeucauController : ControllerBase
    {
        private readonly GarageDbContext _context;

        public YeucauController(GarageDbContext context)
        {
            _context = context;
        }

        // GET: api/Yeucau
        [HttpGet]
        public async Task<ActionResult<IEnumerable<YeucauDichVu>>> GetYeucauDichVus()
        {
            return await _context.YeucauDichVus
                .Include(y => y.DichVu)
                .OrderByDescending(y => y.NgayYeuCau)
                .ToListAsync();
        }

        // GET: api/Yeucau/5
        [HttpGet("{id}")]
        public async Task<ActionResult<YeucauDichVu>> GetYeucauDichVu(int id)
        {
            var yeucau = await _context.YeucauDichVus
                .Include(y => y.DichVu)
                .FirstOrDefaultAsync(y => y.MaYeuCau == id);

            if (yeucau == null)
                return NotFound();

            return yeucau;
        }

        // POST: api/Yeucau
        [HttpPost]
        public async Task<ActionResult<YeucauDichVu>> PostYeucauDichVu(YeucauDichVu yeucau)
        {
            yeucau.NgayYeuCau = DateTime.Now;
            yeucau.TrangThai = "Mới";
            
            _context.YeucauDichVus.Add(yeucau);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetYeucauDichVu), new { id = yeucau.MaYeuCau }, yeucau);
        }

        // PUT: api/Yeucau/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutYeucauDichVu(int id, YeucauDichVu yeucau)
        {
            if (id != yeucau.MaYeuCau)
                return BadRequest();

            _context.Entry(yeucau).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!YeucauExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Yeucau/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteYeucauDichVu(int id)
        {
            var yeucau = await _context.YeucauDichVus.FindAsync(id);
            if (yeucau == null)
                return NotFound();

            _context.YeucauDichVus.Remove(yeucau);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool YeucauExists(int id)
        {
            return _context.YeucauDichVus.Any(e => e.MaYeuCau == id);
        }
    }
}

