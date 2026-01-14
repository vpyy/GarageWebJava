import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    tenKhachHang: '',
    soDienThoai: '',
    diaChi: '',
    ngayHen: '',
    gioHen: '',
    ghiChu: ''
  });

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await fetch(`http://localhost:5102/api/DichVu/${id}`);
      if (response.ok) {
        const data = await response.json();
        setService(data);
      }
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
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
        gioHen: form.gioHen
      };

      const response = await fetch('http://localhost:5102/api/Yeucau', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        navigate('/services');
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-5 text-center">
        <h3>Không tìm thấy dịch vụ</h3>
        <button onClick={() => navigate('/services')} className="btn btn-primary mt-3">
          Quay lại danh sách dịch vụ
        </button>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3rem 0 2rem;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .booking-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 1rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          margin-bottom: 2rem;
        }

        .booking-card h4 {
          font-weight: 800;
          color: #212529;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f8f9fa;
        }

        .service-info-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 1rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .service-info-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .service-info-card .card-body {
          padding: 1.5rem;
        }

        .service-info-card h6 {
          font-weight: 700;
          color: #212529;
          margin-bottom: 0.75rem;
        }

        .service-info-card .text-muted {
          color: #6c757d !important;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .price-badge {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0d6efd;
        }

        .contact-info-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 1rem;
          padding: 1.5rem;
        }

        .contact-info-card h6 {
          font-weight: 700;
          color: #212529;
          margin-bottom: 1rem;
        }

        .contact-info-card p {
          color: #6c757d;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
        }

        .contact-info-card i {
          color: #0d6efd;
          width: 24px;
        }

        /* Form styling */
        .form-label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 0.5rem;
        }

        .form-control {
          border: 1px solid #ced4da;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-outline-primary {
          border: 2px solid #0d6efd;
          color: #0d6efd;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-outline-primary:hover {
          background: #0d6efd;
          color: white;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="page-header">
        <div className="container text-center">
          <h1>Đặt lịch hẹn dịch vụ</h1>
          <p>Vui lòng điền đầy đủ thông tin để chúng tôi có thể phục vụ bạn tốt nhất</p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="booking-card">
              <h4><i className="fas fa-calendar-check me-2"></i>Thông tin đặt lịch</h4>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="tenKhachHang" className="form-label">Họ và tên *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tenKhachHang"
                      name="tenKhachHang"
                      value={form.tenKhachHang}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="soDienThoai" className="form-label">Số điện thoại *</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="soDienThoai"
                      name="soDienThoai"
                      value={form.soDienThoai}
                      onChange={handleInputChange}
                      placeholder="0123456789"
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="diaChi" className="form-label">Địa chỉ *</label>
                  <textarea
                    className="form-control"
                    id="diaChi"
                    name="diaChi"
                    value={form.diaChi}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Nhập địa chỉ của bạn"
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="ngayHen" className="form-label">Ngày đến gara *</label>
                    <input
                      type="date"
                      className="form-control"
                      id="ngayHen"
                      name="ngayHen"
                      value={form.ngayHen}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="gioHen" className="form-label">Giờ hẹn *</label>
                    <input
                      type="time"
                      className="form-control"
                      id="gioHen"
                      name="gioHen"
                      value={form.gioHen}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="ghiChu" className="form-label">Ghi chú</label>
                  <textarea
                    className="form-control"
                    id="ghiChu"
                    name="ghiChu"
                    value={form.ghiChu}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Mô tả chi tiết về vấn đề của xe hoặc yêu cầu đặc biệt..."
                  />
                </div>
                <div className="d-flex gap-3 justify-content-end">
                  <button
                    type="button"
                    onClick={() => navigate('/customer/services')}
                    className="btn btn-outline-primary me-md-2"
                  >
                    <i className="fas fa-arrow-left me-2"></i>Quay lại
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
          <div className="col-lg-4">
            <div className="service-info-card">
              <img
                src={service.hinhAnh || "https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg"}
                alt={service.tenDV || service.tenDichVu}
              />
              <div className="card-body">
                <h6>{service.tenDV || service.tenDichVu}</h6>
                <p className="text-muted mb-3">{service.moTa}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="price-badge">{(service.donGia || service.gia || 0).toLocaleString()} ₫</span>
                  {service.trangThai ? (
                    <span className="badge bg-success">
                      <i className="fas fa-check me-1"></i>Có sẵn
                    </span>
                  ) : (
                    <span className="badge bg-secondary">
                      <i className="fas fa-pause me-1"></i>Tạm ngưng
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="contact-info-card">
              <h6><i className="fas fa-info-circle me-2"></i>Thông tin liên hệ</h6>
              <p><i className="fas fa-phone"></i>038 442 4567</p>
              <p><i className="fas fa-envelope"></i>contact@mtproauto.vn</p>
              <p className="mb-0"><i className="fas fa-map-marker-alt"></i>Ngã 4 An Dương Vương, Trần Phú, Quảng Ngãi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingPage;