import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/dich-vu');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        console.error('Response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(
    service =>
      (service.tenDV || service.tenDichVu || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      service.moTa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '400px' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 0;
          margin-bottom: 3rem;
        }

        .hero-section h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .hero-section p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .search-box {
          background: white;
          border-radius: 50px;
          padding: 0.5rem 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border: none;
          font-size: 1.1rem;
        }

        .service-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          border-color: #06b6d4;
        }

        .service-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .service-card:hover img {
          transform: scale(1.1);
        }

        .service-card .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .service-card h5 {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
          min-height: 2.8em;
        }

        .service-card .description {
          color: #64748b;
          font-size: 0.85rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.5em;
          flex-grow: 1;
        }

        .service-card .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid #f3f4f6;
        }

        .price {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0d6efd;
          flex-shrink: 0;
        }

        .btn-book {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .btn-book:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          color: white;
        }

        .btn-book:disabled {
          background: #9ca3af;
          transform: none;
          box-shadow: none;
        }

        /* Grid Layout - 4 cột như .cshtml */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        /* Responsive - giống như .cshtml */
        @media (max-width: 1200px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
          .hero-section h1 { 
            font-size: 2rem; 
          }
        }

        .stats-section {
          background: #f8f9fa;
          padding: 4rem 0;
          margin: 4rem 0;
        }

        .car-specs {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
          min-width: 200px;
        }

        .spec-item i {
          font-size: 2.5rem;
          color: #0d6efd;
          width: 60px;
          text-align: center;
        }

        .spec-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0d6efd;
          display: block;
          line-height: 1;
        }

        .spec-label {
          color: #64748b;
          font-weight: 600;
          font-size: 1rem;
          margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .car-specs {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .spec-item {
            justify-content: center;
            text-align: center;
            min-width: auto;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 1200px) {
          .contact-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .contact-luxury {
          background: #f8f9fa;
          padding: 4rem 0;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .contact-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }

        .contact-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .contact-card-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 2rem;
        }

        .contact-card h4 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .contact-card p {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 0;
        }

        /* Pagination Styles */
        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 3rem 0;
          gap: 0.5rem;
        }

        .pagination-btn {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          background: white;
          color: #374151;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .pagination-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0 1rem;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="container text-center">
          <h1>Dịch vụ chăm sóc xe</h1>
          <p>
            Chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc và bảo dưỡng xe hơi
            chuyên nghiệp
          </p>

          <div className="row justify-content-center mt-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control search-box"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="container">
          <div className="car-specs">
            <div className="spec-item">
              <i className="fas fa-tools"></i>
              <div>
                <span className="spec-value">{services.length}</span>
                <div className="spec-label">Dịch vụ chuyên nghiệp</div>
              </div>
            </div>
            <div className="spec-item">
              <i className="fas fa-users"></i>
              <div>
                <span className="spec-value">500+</span>
                <div className="spec-label">Khách hàng hài lòng</div>
              </div>
            </div>
            <div className="spec-item">
              <i className="fas fa-award"></i>
              <div>
                <span className="spec-value">5+</span>
                <div className="spec-label">Năm kinh nghiệm</div>
              </div>
            </div>
            <div className="spec-item">
              <i className="fas fa-headset"></i>
              <div>
                <span className="spec-value">24/7</span>
                <div className="spec-label">Hỗ trợ khách hàng</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container pb-5">
        <div className="row">
          <div className="col-12 mb-4">
            <h2 className="text-center mb-4">Danh sách dịch vụ</h2>
            {searchTerm && (
              <p className="text-center text-muted">
                Tìm thấy {filteredServices.length} dịch vụ cho "{searchTerm}"
              </p>
            )}
            {!searchTerm && (
              <p className="text-center text-muted">
                Hiển thị {startIndex + 1}-
                {Math.min(endIndex, filteredServices.length)} trong tổng số{' '}
                {filteredServices.length} dịch vụ
              </p>
            )}
          </div>
        </div>

        <div className="services-grid">
          {currentServices.length > 0 ? (
            currentServices.map(service => (
              <div key={service.maDV || service.id} className="service-card">
                <img
                  src={
                    service.hinhAnh ||
                    'https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg'
                  }
                  alt={service.tenDV || service.tenDichVu}
                />
                <div className="card-body">
                  <h5>{service.tenDV || service.tenDichVu}</h5>
                  <p className="description">{service.moTa}</p>

                  <div className="card-footer">
                    <span className="price">
                      {(service.donGia || service.gia || 0).toLocaleString()}₫
                    </span>
                    <div className="d-flex align-items-center gap-2">
                      {service.trangThai ? (
                        <span className="badge bg-success">Có sẵn</span>
                      ) : (
                        <span className="badge bg-secondary">Tạm ngưng</span>
                      )}
                      <button
                        className="btn btn-book"
                        onClick={() =>
                          navigate(
                            `/customer/services/${service.maDV || service.id}/book`
                          )
                        }
                        disabled={!service.trangThai}
                      >
                        <i className="fas fa-calendar-plus me-2"></i>
                        Đặt lịch
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="col-12 text-center py-5"
              style={{ gridColumn: '1 / -1' }}
            >
              <i
                className="fas fa-search"
                style={{
                  fontSize: '64px',
                  color: '#94a3b8',
                  marginBottom: '1rem',
                }}
              ></i>
              <h4>Không tìm thấy dịch vụ</h4>
              <p className="text-muted">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <section className="contact-luxury">
        <div className="container">
          <div className="contact-header">
            <h2 className="section-label">LIÊN HỆ VỚI CHÚNG TÔI</h2>
            <h3 className="section-title">Cần tư vấn thêm?</h3>
            <p className="section-desc">
              Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
              Hãy liên hệ ngay để được tư vấn miễn phí!
            </p>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-card-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h4>Địa chỉ</h4>
              <p>Ngã 4 An Dương Vương, Trần Phú, Quảng Ngãi</p>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <h4>Hotline</h4>
              <p>038 442 4567</p>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h4>Email</h4>
              <p>contact@garagego.vn</p>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h4>Đặt lịch</h4>
              <p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/customer/contact')}
                >
                  Liên hệ ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
