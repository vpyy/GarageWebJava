using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GarageGo_BE.Data;
using GarageGo_BE.Models;

namespace GarageGo_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class XeController : ControllerBase
    {
        private readonly GarageDbContext _context;

        public XeController(GarageDbContext context)
        {
            _context = context;
        }

        // GET: api/Xe
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetXes()
        {
            var xes = await _context.Xes
                .Include(x => x.KhachHang)
                .ToListAsync();
            
            var result = xes.Select(x => new
            {
                maXe = x.MaXe,
                bienSo = x.BienSo,
                hangXe = x.HangXe,
                doiXe = x.DoiXe,
                mauXe = x.MauXe,
                maKH = x.MaKH,
                khachHang = x.KhachHang != null ? new
                {
                    maKH = x.KhachHang.MaKH,
                    tenKH = x.KhachHang.TenKH,
                    sdt = x.KhachHang.SDT,
                    email = x.KhachHang.Email,
                    diaChi = x.KhachHang.DiaChi
                } : null
            });
            
            return Ok(result);
        }

        // GET: api/Xe/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetXe(int id)
        {
            var xe = await _context.Xes
                .Include(x => x.KhachHang)
                .FirstOrDefaultAsync(x => x.MaXe == id);

            if (xe == null)
                return NotFound();

            var result = new
            {
                maXe = xe.MaXe,
                bienSo = xe.BienSo,
                hangXe = xe.HangXe,
                doiXe = xe.DoiXe,
                mauXe = xe.MauXe,
                maKH = xe.MaKH,
                khachHang = xe.KhachHang != null ? new
                {
                    maKH = xe.KhachHang.MaKH,
                    tenKH = xe.KhachHang.TenKH,
                    sdt = xe.KhachHang.SDT,
                    email = xe.KhachHang.Email,
                    diaChi = xe.KhachHang.DiaChi
                } : null
            };

            return Ok(result);
        }

        // GET: api/Xe/ByKhachHang/5
        [HttpGet("ByKhachHang/{maKH}")]
        public async Task<ActionResult<IEnumerable<Xe>>> GetXesByKhachHang(int maKH)
        {
            return await _context.Xes
                .Where(x => x.MaKH == maKH)
                .Include(x => x.KhachHang)
                .ToListAsync();
        }

        // GET: api/Xe/ByBienSo/{bienSo}
        [HttpGet("ByBienSo/{bienSo}")]
        public async Task<ActionResult<Xe>> GetXeByBienSo(string bienSo)
        {
            var xe = await _context.Xes
                .Include(x => x.KhachHang)
                .FirstOrDefaultAsync(x => x.BienSo == bienSo);

            if (xe == null)
                return NotFound();

            return xe;
        }

        // POST: api/Xe
        [HttpPost]
        public async Task<ActionResult<Xe>> PostXe(Xe xe)
        {
            // Kiểm tra biển số đã tồn tại chưa
            if (await _context.Xes.AnyAsync(x => x.BienSo == xe.BienSo))
            {
                return BadRequest("Biển số xe đã tồn tại");
            }

            _context.Xes.Add(xe);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetXe), new { id = xe.MaXe }, xe);
        }

        // PUT: api/Xe/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutXe(int id, Xe xe)
        {
            if (id != xe.MaXe)
                return BadRequest();

            // Kiểm tra biển số đã tồn tại chưa (trừ xe hiện tại)
            if (await _context.Xes.AnyAsync(x => x.BienSo == xe.BienSo && x.MaXe != id))
            {
                return BadRequest("Biển số xe đã tồn tại");
            }

            _context.Entry(xe).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XeExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Xe/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteXe(int id)
        {
            var xe = await _context.Xes.FindAsync(id);
            if (xe == null)
                return NotFound();

            // Kiểm tra xe có hóa đơn không
            if (await _context.HoaDons.AnyAsync(h => h.MaXe == id))
            {
                return BadRequest("Không thể xóa xe đã có hóa đơn");
            }

            _context.Xes.Remove(xe);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool XeExists(int id)
        {
            return _context.Xes.Any(e => e.MaXe == id);
        }
    }
}
