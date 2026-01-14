import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearError } from '../../store/slices/cartSlice';
import { RootState } from '../../store';
import toast from 'react-hot-toast';

interface Product {
  maSP: number;
  tenSP: string;
  donGia: number;
  moTa: string;
  hinhAnh: string;
  soLuongTon: number;
  donVi?: string;
}

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { error } = useSelector((state: RootState) => state.cart);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from:', 'http://localhost:5102/api/SanPham');
      const response = await fetch('http://localhost:5102/api/SanPham');
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Products data:', data);
        setProducts(data);
      } else {
        console.error('Response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.tenSP.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.moTa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/auth/login');
      return;
    }

    dispatch(addToCart({
      id: product.maSP,
      name: product.tenSP,
      price: product.donGia,
      quantity: 1,
      image: product.hinhAnh,
      stock: product.soLuongTon,
      isAuthenticated
    }));
    
    if (!error) {
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
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

        .product-card {
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

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          border-color: #06b6d4;
        }

        .product-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover img {
          transform: scale(1.1);
        }

        .product-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          padding: 0.4rem 0.85rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.8rem;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .quick-view {
          width: 45px;
          height: 45px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e293b;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .quick-view:hover {
          background: #0d6efd;
          color: white;
          transform: scale(1.1);
        }

        .quick-view:disabled {
          background: #9ca3af;
          color: white;
          cursor: not-allowed;
          transform: none;
        }

        .product-card .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .product-card h5 {
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

        .product-card .description {
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

        .card-footer {
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

        .stock-info {
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* Grid Layout - 4 cột như .cshtml */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        /* Responsive - giống như .cshtml */
        @media (max-width: 1200px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .products-grid {
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
          <h1>Sản phẩm chất lượng</h1>
          <p>Phụ tùng và phụ kiện ô tô chính hãng với giá cả cạnh tranh</p>
          
          <div className="row justify-content-center mt-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control search-box"
                placeholder="Tìm kiếm sản phẩm..."
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
              <i className="fas fa-box"></i>
              <div>
                <span className="spec-value">{products.length}</span>
                <div className="spec-label">Sản phẩm chất lượng</div>
              </div>
            </div>
            <div className="spec-item">
              <i className="fas fa-users"></i>
              <div>
                <span className="spec-value">1000+</span>
                <div className="spec-label">Khách hàng tin tưởng</div>
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
              <i className="fas fa-shipping-fast"></i>
              <div>
                <span className="spec-value">24/7</span>
                <div className="spec-label">Giao hàng nhanh</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container pb-5">
        <div className="row">
          <div className="col-12 mb-4">
            <h2 className="text-center mb-4">Danh sách sản phẩm</h2>
            {searchTerm && (
              <p className="text-center text-muted">
                Tìm thấy {filteredProducts.length} sản phẩm cho "{searchTerm}"
              </p>
            )}
            {!searchTerm && (
              <p className="text-center text-muted">
                Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
              </p>
            )}
          </div>
        </div>

        <div className="products-grid">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.maSP} className="product-card">
                <div style={{ position: 'relative' }}>
                  <img
                    src={product.hinhAnh || "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg"}
                    alt={product.tenSP}
                  />
                  {product.soLuongTon > 0 ? (
                    <span className="product-badge bg-success text-white">
                      <i className="fas fa-check me-1"></i>Còn {product.soLuongTon}
                    </span>
                  ) : (
                    <span className="product-badge bg-warning text-white">
                      <i className="fas fa-exclamation me-1"></i>Hết hàng
                    </span>
                  )}
                  <div className="product-overlay">
                    <button
                      className="quick-view"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.soLuongTon <= 0}
                      title={isAuthenticated ? "Thêm vào giỏ hàng" : "Đăng nhập để thêm vào giỏ hàng"}
                    >
                      <i className="fas fa-cart-plus"></i>
                    </button>
                    <button
                      className="quick-view"
                      onClick={() => navigate(`/customer/products/${product.maSP}`)}
                      title="Xem chi tiết"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h5>{product.tenSP}</h5>
                  <p className="description">{product.moTa}</p>
                  
                  <div className="card-footer">
                    <span className="price">{product.donGia.toLocaleString()}₫</span>
                    <div className="stock-info">
                      {product.soLuongTon > 0 ? (
                        <span className="text-success">
                          <i className="fas fa-check me-1"></i>Còn hàng
                        </span>
                      ) : (
                        <span className="text-warning">
                          <i className="fas fa-times me-1"></i>Hết hàng
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5" style={{ gridColumn: '1 / -1' }}>
              <i className="fas fa-search" style={{ fontSize: '64px', color: '#94a3b8', marginBottom: '1rem' }}></i>
              <h4>Không tìm thấy sản phẩm</h4>
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
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            <p className="section-desc">Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ ngay để được tư vấn miễn phí!</p>
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
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h4>Mua sắm</h4>
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