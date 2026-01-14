using Microsoft.EntityFrameworkCore;
using GarageGo_BE.Models;

namespace GarageGo_BE.Data
{
    public class GarageDbContext : DbContext
    {
        public GarageDbContext(DbContextOptions<GarageDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<KhachHang> KhachHangs { get; set; }
        public DbSet<Xe> Xes { get; set; }
        public DbSet<DichVu> DichVus { get; set; }
        public DbSet<SanPham> SanPhams { get; set; }
        public DbSet<HoaDon> HoaDons { get; set; }
        public DbSet<ChiTietHDDV> ChiTietHDDVs { get; set; }
        public DbSet<ChiTietHDSP> ChiTietHDSPs { get; set; }
        public DbSet<YeucauDichVu> YeucauDichVus { get; set; }
        public DbSet<LienHe> LienHes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map table names to match MySQL database
            modelBuilder.Entity<User>().ToTable("USERS");
            modelBuilder.Entity<KhachHang>().ToTable("KHACHHANG");
            modelBuilder.Entity<Xe>().ToTable("XE");
            modelBuilder.Entity<DichVu>().ToTable("DICHVU");
            modelBuilder.Entity<SanPham>().ToTable("SANPHAM");
            modelBuilder.Entity<YeucauDichVu>().ToTable("YEUCAU_DICHVU");
            modelBuilder.Entity<LienHe>().ToTable("LIENHE");
            modelBuilder.Entity<HoaDon>().ToTable("HOADON");
            modelBuilder.Entity<ChiTietHDDV>().ToTable("CHITIET_HDDV");
            modelBuilder.Entity<ChiTietHDSP>().ToTable("CHITIET_HDSP");

            // Configure for MySQL
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<KhachHang>(entity =>
            {
                entity.Property(e => e.NgayDangKy).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<HoaDon>(entity =>
            {
                entity.Property(e => e.NgayLap).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Bỏ computed column config để tránh trigger issue
            // ThanhTien sẽ được tính trong code
        }
    }
}