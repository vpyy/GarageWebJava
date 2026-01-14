import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

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

interface Product {
  maSP: number;
  tenSP: string;
  donGia: number;
  moTa: string;
  hinhAnh: string;
  soLuongTon: number;
}

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
    startSlider();
    return () => stopSlider();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch services
      const servicesResponse = await fetch('http://localhost:5102/api/DichVu');
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData); // Load all services for pagination
      }

      // Fetch products
      const productsResponse = await fetch('http://localhost:5102/api/SanPham');
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData); // Load all products for pagination
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product.maSP,
      name: product.tenSP,
      price: product.donGia,
      quantity: 1,
      image: product.hinhAnh,
      stock: product.soLuongTon,
      isAuthenticated: true
    }));
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const slides = [
    {
      bg: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920',
      badge: 'PREMIUM AUTO SERVICE',
      title: 'GarageGo',
      subtitle: 'Dịch vụ sửa chữa & bảo dưỡng ô tô chuyên nghiệp hàng đầu',
      buttons: [
        { text: 'Khám phá dịch vụ', icon: 'fas fa-tools', link: '#services', type: 'primary' },
        { text: 'Xem sản phẩm', icon: 'fas fa-shopping-bag', link: '/customer/products', type: 'outline' }
      ]
    },
    {
      bg: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920',
      badge: 'PROFESSIONAL TEAM',
      title: 'Đội ngũ chuyên nghiệp',
      subtitle: 'Kỹ thuật viên giàu kinh nghiệm, trang thiết bị hiện đại',
      buttons: [
        { text: 'Đặt lịch ngay', icon: 'fas fa-calendar-check', link: '/customer/services', type: 'primary' },
        { text: 'Liên hệ tư vấn', icon: 'fas fa-phone', link: '/customer/contact', type: 'outline' }
      ]
    },
    {
      bg: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920',
      badge: 'GENUINE PARTS',
      title: 'Phụ tùng chính hãng',
      subtitle: '100% phụ tùng chính hãng, giá cả cạnh tranh, bảo hành dài hạn',
      buttons: [
        { text: 'Mua sắm ngay', icon: 'fas fa-shopping-cart', link: '/customer/products', type: 'primary' },
        { text: 'Tìm hiểu thêm', icon: 'fas fa-info-circle', link: '#about', type: 'outline' }
      ]
    }
  ];

  let slideInterval: NodeJS.Timeout;

  const showSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const startSlider = () => {
    slideInterval = setInterval(nextSlide, 5000);
  };

  const stopSlider = () => {
    clearInterval(slideInterval);
  };

  // Pagination logic for services
  const totalServicePages = Math.ceil(services.length / itemsPerPage);
  const serviceStartIndex = (currentServicePage - 1) * itemsPerPage;
  const serviceEndIndex = serviceStartIndex + itemsPerPage;
  const currentServices = services.slice(serviceStartIndex, serviceEndIndex);

  // Pagination logic for products
  const totalProductPages = Math.ceil(products.length / itemsPerPage);
  const productStartIndex = (currentProductPage - 1) * itemsPerPage;
  const productEndIndex = productStartIndex + itemsPerPage;
  const currentProducts = products.slice(productStartIndex, productEndIndex);

  const handleServicePageChange = (page: number) => {
    setCurrentServicePage(page);
    document.getElementById('services-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProductPageChange = (page: number) => {
    setCurrentProductPage(page);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <style>{`
        /* Hero Slider Section */
        .hero-luxury {
          position: relative;
          height: 100vh;
          overflow: hidden;
        }

        .hero-slider {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }

        .hero-slide.active {
          opacity: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
        }

        .hero-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
          z-index: 2;
          width: 100%;
        }

        .hero-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 1rem;
          display: inline-block;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .hero-subtitle {
          font-size: 1.3rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-luxury {
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-luxury.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: 2px solid transparent;
        }

        .btn-luxury.outline {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-luxury:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          color: white;
        }

        .slider-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 3;
        }

        .slider-nav:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .slider-nav.prev {
          left: 2rem;
        }

        .slider-nav.next {
          right: 2rem;
        }

        .slider-dots {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 3;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: white;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          text-align: center;
          z-index: 3;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }

        /* Featured Car Section */
        .featured-car-section {
          padding: 5rem 0;
          background: #f8f9fa;
        }

        .featured-car-image {
          position: relative;
        }

        .featured-car-image img {
          width: 100%;
          border-radius: 20px;
        }

        .car-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          text-align: center;
        }

        .car-badge .year {
          display: block;
          font-size: 1.2rem;
          font-weight: 800;
        }

        .car-badge .model {
          display: block;
          font-size: 0.9rem;
        }

        .featured-car-info {
          padding: 2rem 0;
        }

        .section-label {
          color: #06b6d4;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .featured-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .featured-desc {
          color: #64748b;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .car-specs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: center;
          flex-direction: column;
        }

        .spec-item i {
          font-size: 2.5rem;
          color: #0d6efd;
          margin-bottom: 0.5rem;
        }

        .spec-value {
          font-size: 2rem;
          font-weight: 800;
          color: #0d6efd;
          display: block;
          line-height: 1;
        }

        .spec-label {
          color: #64748b;
          font-weight: 600;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .featured-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-luxury.dark {
          background: #1e293b;
          color: white;
          border: 2px solid #1e293b;
        }

        /* Services Section */
        .services-luxury {
          padding: 5rem 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .section-desc {
          color: #64748b;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .service-luxury-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }

        .service-luxury-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .service-icon {
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

        .service-luxury-card h4 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .service-luxury-card p {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .service-link {
          color: #0d6efd;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .service-link:hover {
          color: #0a58ca;
        }

        /* Contact Section */
        .contact-luxury {
          padding: 5rem 0;
          background: #f8f9fa;
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

        /* Products Section */
        .products-luxury {
          padding: 5rem 0;
          background: #f8f9fa;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .product-luxury-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .product-luxury-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .product-image {
          position: relative;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-luxury-card:hover .product-image img {
          transform: scale(1.1);
        }

        .product-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .product-badge.in-stock {
          background: #22c55e;
          color: white;
        }

        .product-badge.out-stock {
          background: #ef4444;
          color: white;
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

        .product-luxury-card:hover .product-overlay {
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
          text-decoration: none;
        }

        .quick-view:hover {
          background: #0d6efd;
          color: white;
          transform: scale(1.1);
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-info h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .product-info p {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0d6efd;
        }

        .btn-add-cart {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-add-cart:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        /* Services List Section */
        .services-list-luxury {
          padding: 5rem 0;
        }

        .services-list-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .service-list-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .service-list-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .service-list-image {
          position: relative;
          overflow: hidden;
        }

        .service-list-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .service-list-card:hover .service-list-image img {
          transform: scale(1.1);
        }

        .service-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #22c55e;
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .service-list-info {
          padding: 1.5rem;
        }

        .service-list-info h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .service-list-info p {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .service-list-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-book:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          color: white;
        }

        /* CTA Section */
        .cta-luxury {
          position: relative;
          padding: 5rem 0;
          background-image: url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920');
          background-size: cover;
          background-position: center;
          color: white;
        }

        .cta-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
        }

        .cta-content {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .cta-content p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-luxury.light {
          background: white;
          color: #1e293b;
          border: 2px solid white;
        }

        .btn-luxury.outline-light {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .services-grid, .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .services-list-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .car-specs, .contact-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .services-grid, .products-grid, .services-list-grid {
            grid-template-columns: 1fr;
          }
          .car-specs, .contact-grid {
            grid-template-columns: 1fr;
          }
          .hero-buttons, .featured-buttons, .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
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

      {/* Hero Slider Section */}
      <section className="hero-luxury">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url('${slide.bg}')` }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <div className="container">
                  <div className="hero-badge">{slide.badge}</div>
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <div className="hero-buttons">
                    {slide.buttons.map((button, btnIndex) => (
                      <Link
                        key={btnIndex}
                        to={button.link}
                        className={`btn-luxury ${button.type}`}
                      >
                        <i className={button.icon}></i> {button.text}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Slider Navigation */}
        <button className="slider-nav prev" onClick={() => { stopSlider(); prevSlide(); startSlider(); }}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="slider-nav next" onClick={() => { stopSlider(); nextSlide(); startSlider(); }}>
          <i className="fas fa-chevron-right"></i>
        </button>
        
        {/* Slider Dots */}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => { stopSlider(); showSlide(index); startSlider(); }}
            ></span>
          ))}
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span>Cuộn xuống</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* Featured Car Section */}
      <section className="featured-car-section" id="about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="featured-car-image">
                <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800" alt="Featured Car" />
                <div className="car-badge">
                  <span className="year">2024</span>
                  <span className="model">ZK16</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="featured-car-info">
                <h2 className="section-label">VỀ CHÚNG TÔI</h2>
                <h3 className="featured-title">GarageGo - Đối tác tin cậy cho xe của bạn</h3>
                <p className="featured-desc">Với hơn 10 năm kinh nghiệm trong ngành, GarageGo tự hào là địa chỉ uy tín hàng đầu trong lĩnh vực sửa chữa và bảo dưỡng ô tô. Chúng tôi cam kết mang đến dịch vụ chất lượng cao nhất với giá cả hợp lý.</p>
                <div className="car-specs">
                  <div className="spec-item">
                    <i className="fas fa-tachometer-alt"></i>
                    <div>
                      <span className="spec-value">10K+</span>
                      <span className="spec-label">Khách hàng</span>
                    </div>
                  </div>
                  <div className="spec-item">
                    <i className="fas fa-car"></i>
                    <div>
                      <span className="spec-value">50K+</span>
                      <span className="spec-label">Xe bảo dưỡng</span>
                    </div>
                  </div>
                  <div className="spec-item">
                    <i className="fas fa-award"></i>
                    <div>
                      <span className="spec-value">10+</span>
                      <span className="spec-label">Năm kinh nghiệm</span>
                    </div>
                  </div>
                  <div className="spec-item">
                    <i className="fas fa-star"></i>
                    <div>
                      <span className="spec-value">4.9/5</span>
                      <span className="spec-label">Đánh giá</span>
                    </div>
                  </div>
                </div>
                <div className="featured-buttons">
                  <Link to="/customer/contact" className="btn-luxury primary">Liên hệ ngay</Link>
                  <Link to="/customer/services" className="btn-luxury dark">Xem dịch vụ</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-luxury" id="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-label">DỊCH VỤ CỦA CHÚNG TÔI</h2>
            <h3 className="section-title">Dịch vụ chuyên nghiệp</h3>
            <p className="section-desc">Chúng tôi cung cấp đầy đủ các dịch vụ sửa chữa và bảo dưỡng ô tô với chất lượng cao nhất</p>
          </div>
          <div className="services-grid">
            <div className="service-luxury-card">
              <div className="service-icon">
                <i className="fas fa-oil-can"></i>
              </div>
              <h4>Thay dầu & Bảo dưỡng</h4>
              <p>Dịch vụ thay dầu định kỳ và bảo dưỡng toàn diện cho xe của bạn</p>
              <Link to="/customer/services" className="service-link">Tìm hiểu thêm <i className="fas fa-arrow-right"></i></Link>
            </div>
            <div className="service-luxury-card">
              <div className="service-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h4>Sửa chữa động cơ</h4>
              <p>Chẩn đoán và sửa chữa các vấn đề động cơ với thiết bị hiện đại</p>
              <Link to="/customer/services" className="service-link">Tìm hiểu thêm <i className="fas fa-arrow-right"></i></Link>
            </div>
            <div className="service-luxury-card">
              <div className="service-icon">
                <i className="fas fa-car-crash"></i>
              </div>
              <h4>Sửa chữa thân vỏ</h4>
              <p>Phục hồi và sửa chữa thân vỏ xe sau va chạm, tai nạn</p>
              <Link to="/customer/services" className="service-link">Tìm hiểu thêm <i className="fas fa-arrow-right"></i></Link>
            </div>
            <div className="service-luxury-card">
              <div className="service-icon">
                <i className="fas fa-spray-can"></i>
              </div>
              <h4>Sơn xe chuyên nghiệp</h4>
              <p>Dịch vụ sơn xe với công nghệ tiên tiến, màu sắc chuẩn xác</p>
              <Link to="/customer/services" className="service-link">Tìm hiểu thêm <i className="fas fa-arrow-right"></i></Link>
            </div>
            <div className="service-luxury-card">
              <div className="service-icon">
                <i className="fas fa-snowflake"></i>
              </div>
              <h4>Điều hòa & Điện lạnh</h4>
              <p>Bảo trì và sửa chữa hệ thống điều hòa, điện lạnh ô tô</p>
              <Link to="/customer/services" className="service-link">Tìm hiểu thêm <i className="fas fa-arrow-right"></i></Link>
            </div>
            <div className="service-luxury-card">
              <div className="service-icon">
                <i className="fas fa-tire"></i>
              </div>
              <h4>Lốp & Phanh</h4>
              <p>Kiểm tra, thay thế lốp xe và hệ thống phanh an toàn</p>
              <Link to="/customer/services" className="service-link">Tìm hiểu thêm <i className="fas fa-arrow-right"></i></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-luxury">
        <div className="container">
          <div className="contact-header">
            <h2 className="section-label">LIÊN HỆ VỚI CHÚNG TÔI</h2>
            <h3 className="section-title">Bạn cần hỗ trợ?</h3>
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
                <i className="fas fa-clock"></i>
              </div>
              <h4>Giờ làm việc</h4>
              <p>7:00 - 18:00<br/>(Thứ 2 - Chủ nhật)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-luxury" id="products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-label">SẢN PHẨM NỔI BẬT</h2>
            <h3 className="section-title">Phụ tùng chính hãng</h3>
            <p className="section-desc">Phụ tùng và phụ kiện ô tô chính hãng, chất lượng cao với giá cả cạnh tranh</p>
          </div>
          <div className="products-grid">
            {currentProducts.map((product) => (
              <div key={product.maSP} className="product-luxury-card">
                <div className="product-image">
                  <img 
                    src={product.hinhAnh || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"} 
                    alt={product.tenSP} 
                  />
                  {product.soLuongTon > 0 ? (
                    <span className="product-badge in-stock">
                      <i className="fas fa-check"></i> Còn hàng
                    </span>
                  ) : (
                    <span className="product-badge out-stock">
                      <i className="fas fa-times"></i> Hết hàng
                    </span>
                  )}
                  <div className="product-overlay">
                    <button 
                      className="quick-view" 
                      onClick={() => handleAddToCart(product)}
                      disabled={(product.soLuongTon || 0) <= 0}
                    >
                      <i className="fas fa-cart-plus"></i>
                    </button>
                    <Link 
                      to={`/customer/products/${product.maSP}`} 
                      className="quick-view"
                    >
                      <i className="fas fa-eye"></i>
                    </Link>
                  </div>
                </div>
                <div className="product-info">
                  <h4>{product.tenSP}</h4>
                  <p>{product.moTa}</p>
                  <div className="product-footer">
                    <span className="price">{product.donGia.toLocaleString()} ₫</span>
                    {product.soLuongTon > 0 && (
                      <button 
                        className="btn-add-cart" 
                        onClick={() => handleAddToCart(product)}
                      >
                        <i className="fas fa-shopping-cart"></i> Thêm
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Products Pagination */}
          {totalProductPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-btn"
                onClick={() => handleProductPageChange(currentProductPage - 1)}
                disabled={currentProductPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {Array.from({ length: totalProductPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${page === currentProductPage ? 'active' : ''}`}
                  onClick={() => handleProductPageChange(page)}
                >
                  {page}
                </button>
              ))}
              
              <button
                className="pagination-btn"
                onClick={() => handleProductPageChange(currentProductPage + 1)}
                disabled={currentProductPage === totalProductPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
          
          <div className="text-center mt-5">
            <Link to="/customer/products" className="btn-luxury primary">
              Xem tất cả sản phẩm <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      {services.length > 0 && (
        <section className="services-list-luxury" id="services-list">
          <div className="container">
            <div className="section-header">
              <h2 className="section-label">DỊCH VỤ HIỆN CÓ</h2>
              <h3 className="section-title">Đặt lịch dịch vụ</h3>
              <p className="section-desc">Chọn dịch vụ phù hợp và đặt lịch ngay hôm nay</p>
            </div>
            <div className="services-list-grid">
              {currentServices.map((service) => (
                <div key={service.maDV || service.id} className="service-list-card">
                  <div className="service-list-image">
                    <img 
                      src={service.hinhAnh || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400"} 
                      alt={service.tenDV || service.tenDichVu} 
                    />
                    {service.trangThai && (
                      <span className="service-badge">
                        <i className="fas fa-check"></i> Có sẵn
                      </span>
                    )}
                  </div>
                  <div className="service-list-info">
                    <h4>{service.tenDV || service.tenDichVu}</h4>
                    <p>{service.moTa}</p>
                    <div className="service-list-footer">
                      <span className="price">{(service.donGia || service.gia || 0).toLocaleString()} ₫</span>
                      <Link 
                        to={`/customer/services/${service.maDV || service.id}/book`} 
                        className="btn-book"
                      >
                        <i className="fas fa-calendar-check"></i> Đặt ngay
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Services Pagination */}
            {totalServicePages > 1 && (
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  onClick={() => handleServicePageChange(currentServicePage - 1)}
                  disabled={currentServicePage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {Array.from({ length: totalServicePages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-btn ${page === currentServicePage ? 'active' : ''}`}
                    onClick={() => handleServicePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  className="pagination-btn"
                  onClick={() => handleServicePageChange(currentServicePage + 1)}
                  disabled={currentServicePage === totalServicePages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
            
            <div className="text-center mt-5">
              <Link to="/customer/services" className="btn-luxury primary">
                Xem tất cả dịch vụ <i className="fas fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-luxury">
        <div className="cta-overlay"></div>
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn sàng trải nghiệm dịch vụ?</h2>
            <p>Liên hệ ngay để được tư vấn miễn phí và nhận ưu đãi đặc biệt dành cho khách hàng mới</p>
            <div className="cta-buttons">
              <Link to="/customer/contact" className="btn-luxury light">
                <i className="fas fa-phone-alt"></i> Liên hệ ngay
              </Link>
              <a href="tel:0384424567" className="btn-luxury outline-light">
                <i className="fas fa-headset"></i> Hotline: 038 442 4567
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};