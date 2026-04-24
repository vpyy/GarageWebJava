import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import toast from 'react-hot-toast';

interface Service {
  maDV?: number;
  id?: number;
  tenDV?: string;
  tenDichVu?: string;
  donGia?: number;
  gia?: number;
  moTa: string;
  hinhAnh: string;
  trangThai: boolean;
}

interface BookingForm {
  tenKhachHang: string;
  soDienThoai: string;
  diaChi: string;
  ngayHen: string;
  gioHen: string;
  ghiChu: string;
}

const ServiceBookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    tenKhachHang: '',
    soDienThoai: '',
    diaChi: '',
    ngayHen: '',
    gioHen: '',
    ghiChu: '',
  });

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/dich-vu/${id}`);
      if (res.ok) setService(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const bookingData = {
        tenKhachHang: form.tenKhachHang,
        soDienThoai: form.soDienThoai,
        diaChi: form.diaChi,
        maDV: service?.maDV || service?.id || parseInt(id!),
        ghiChu: form.ghiChu,
        ngayHen: form.ngayHen,
        gioHen: form.gioHen,
        username: user?.username,
      };
      const res = await fetch('/api/yeu-cau', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        setShowDialog(false);
        toast.success(
          'Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.'
        );
        navigate('/customer/service-requests');
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(n);
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '4px',
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="spinner-border text-primary"></div>
      </div>
    );

  if (!service)
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h3>Không tìm thấy dịch vụ</h3>
        <button
          onClick={() => navigate('/customer/services')}
          className="btn btn-primary mt-3"
        >
          Quay lại
        </button>
      </div>
    );

  const tenDV = service.tenDV || service.tenDichVu || '';
  const gia = service.donGia || service.gia || 0;

  return (
    <div
      style={{ minHeight: '80vh', background: '#f8fafc', padding: '2rem 1rem' }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Service card */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px',
          }}
        >
          <img
            src={
              service.hinhAnh ||
              'https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg'
            }
            alt={tenDV}
            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
          />
          <div style={{ padding: '20px 24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#1e293b',
                    margin: '0 0 8px',
                  }}
                >
                  {tenDV}
                </h2>
                <p style={{ color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                  {service.moTa}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#0ea5e9',
                  }}
                >
                  {fmt(gia)}
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: service.trangThai ? '#dcfce7' : '#f1f5f9',
                    color: service.trangThai ? '#15803d' : '#64748b',
                  }}
                >
                  {service.trangThai ? '✓ Có sẵn' : 'Tạm ngưng'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info + nút đặt lịch */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {[
            { icon: 'fa-phone', text: '038 442 4567' },
            { icon: 'fa-envelope', text: 'contact@mtproauto.vn' },
            {
              icon: 'fa-map-marker-alt',
              text: 'Ngã 4 An Dương Vương, Quảng Ngãi',
            },
            { icon: 'fa-clock', text: 'Thứ 2 - Thứ 7: 7:30 - 17:30' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'white',
                padding: '14px 16px',
                borderRadius: '10px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
              }}
            >
              <i
                className={`fas ${item.icon}`}
                style={{ color: '#0ea5e9', width: '18px' }}
              ></i>
              <span style={{ fontSize: '14px', color: '#374151' }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/customer/services')}
            style={{
              flex: 1,
              padding: '14px',
              background: '#f1f5f9',
              color: '#64748b',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '15px',
            }}
          >
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </button>
          <button
            onClick={() => setShowDialog(true)}
            disabled={!service.trangThai}
            style={{
              flex: 2,
              padding: '14px',
              background: service.trangThai
                ? 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'
                : '#e5e7eb',
              color: service.trangThai ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: service.trangThai ? 'pointer' : 'not-allowed',
              fontSize: '15px',
            }}
          >
            <i className="fas fa-calendar-check me-2"></i>Đặt lịch ngay
          </button>
        </div>
      </div>

      {/* Dialog đặt lịch */}
      {showDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowDialog(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                borderRadius: '16px 16px 0 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '18px',
                  }}
                >
                  <i className="fas fa-calendar-check me-2"></i>Đặt lịch dịch vụ
                </h3>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '13px',
                    marginTop: '4px',
                  }}
                >
                  {tenDV} — {fmt(gia)}
                </div>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {/* Họ tên + SĐT */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <label style={labelStyle}>Họ và tên *</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.tenKhachHang}
                    onChange={e =>
                      setForm({ ...form, tenKhachHang: e.target.value })
                    }
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Số điện thoại *</label>
                  <input
                    style={inputStyle}
                    type="tel"
                    value={form.soDienThoai}
                    onChange={e =>
                      setForm({ ...form, soDienThoai: e.target.value })
                    }
                    placeholder="0123456789"
                    required
                  />
                </div>
              </div>

              {/* Địa chỉ */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Địa chỉ *</label>
                <textarea
                  style={{ ...inputStyle, resize: 'none' }}
                  rows={2}
                  value={form.diaChi}
                  onChange={e => setForm({ ...form, diaChi: e.target.value })}
                  placeholder="Nhập địa chỉ của bạn"
                  required
                />
              </div>

              {/* Ngày + Giờ */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <label style={labelStyle}>Ngày hẹn *</label>
                  <input
                    style={inputStyle}
                    type="date"
                    value={form.ngayHen}
                    onChange={e =>
                      setForm({ ...form, ngayHen: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Giờ hẹn *</label>
                  <input
                    style={inputStyle}
                    type="time"
                    value={form.gioHen}
                    onChange={e => setForm({ ...form, gioHen: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Ghi chú */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>
                  Ghi chú về xe / yêu cầu đặc biệt
                </label>
                <textarea
                  style={{ ...inputStyle, resize: 'none' }}
                  rows={3}
                  value={form.ghiChu}
                  onChange={e => setForm({ ...form, ghiChu: e.target.value })}
                  placeholder="Mô tả vấn đề của xe hoặc yêu cầu đặc biệt..."
                />
              </div>

              {/* Nút */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  style={{
                    padding: '10px 20px',
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '10px 24px',
                    background:
                      'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check me-2"></i>Xác nhận đặt lịch
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceBookingPage;
