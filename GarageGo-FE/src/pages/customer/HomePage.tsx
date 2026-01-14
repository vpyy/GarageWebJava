import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider data giống như trong .cshtml
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920',
      badge: 'PREMIUM AUTO SERVICE',
      title: 'MTProAuto',
      subtitle: 'Dịch vụ sửa chữa & bảo dưỡng ô tô chuyên nghiệp hàng đầu',
      buttons: [
        { text: 'Khám phá dịch vụ', icon: 'fas fa-tools', link: '/customer/services', primary: true },
        { text: 'Xem sản phẩm', icon: 'fas fa-shopping-bag', link: '/customer/products', primary: false }
      ]
    },
    {
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920',
      badge: 'PROFESSIONAL TEAM',
      title: 'Đội ngũ chuyên nghiệp',
      subtitle: 'Kỹ thuật viên giàu kinh nghiệm, trang thiết bị hiện đại',
      buttons: [
        { text: 'Đặt lịch ngay', icon: 'fas fa-calendar-check', link: '/customer/services', primary: true },
        { text: 'Liên hệ tư vấn', icon: 'fas fa-phone', link: '/customer/contact', primary: false }
      ]
    },
    {
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920',
      badge: 'GENUINE PARTS',
      title: 'Phụ tùng chính hãng',
      subtitle: '100% phụ tùng chính hãng, giá cả cạnh tranh, bảo hành dài hạn',
      buttons: [
        { text: 'Mua sắm ngay', icon: 'fas fa-shopping-cart', link: '/customer/products', primary: true },
        { text: 'Tìm hiểu thêm', icon: 'fas fa-info-circle', link: '#about', primary: false }
      ]
    }
  ];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Mock data cho các section
  const stats = [
    { number: '10K+', label: 'Khách hàng tin tưởng' },
    { number: '50K+', label: 'Xe bảo dưỡng' },
    { number: '10+', label: 'Năm kinh nghiệm' },
    { number: '4.9/5', label: 'Đánh giá' }
  ];

  const features = [
    {
      icon: 'fas fa-users',
      title: 'Đội ngũ chuyên nghiệp',
      description: 'Kỹ thuật viên giàu kinh nghiệm, được đào tạo bài bản'
    },
    {
      icon: 'fas fa-award',
      title: 'Chất lượng đảm bảo',
      description: 'Cam kết chất lượng dịch vụ và sản phẩm tốt nhất'
    },
    {
      icon: 'fas fa-clock',
      title: 'Phục vụ nhanh chóng',
      description: 'Thời gian xử lý nhanh, tiết kiệm thời gian khách hàng'
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Bảo hành uy tín',
      description: 'Chế độ bảo hành rõ ràng, hỗ trợ tận tình'
    }
  ];

  const services = [
    { id: 1, name: 'Bảo dưỡng định kỳ', price: 500000, description: 'Bảo dưỡng toàn diện theo chu kỳ' },
    { id: 2, name: 'Sửa chữa động cơ', price: 2000000, description: 'Chẩn đoán và sửa chữa động cơ' },
    { id: 3, name: 'Thay dầu máy', price: 300000, description: 'Thay dầu nhớt và lọc dầu' },
    { id: 4, name: 'Kiểm tra phanh', price: 400000, description: 'Kiểm tra và bảo dưỡng hệ thống phanh' },
    { id: 5, name: 'Cân bằng lốp', price: 200000, description: 'Cân bằng và kiểm tra áp suất lốp' },
    { id: 6, name: 'Rửa xe chi tiết', price: 150000, description: 'Rửa xe chuyên nghiệp, làm sạch nội thất' }
  ];

  const products = [
    { id: 1, name: 'Dầu nhớt Castrol', price: 450000, stock: 50, image: null },
    { id: 2, name: 'Lốp Michelin', price: 2500000, stock: 20, image: null },
    { id: 3, name: 'Ắc quy GS', price: 1200000, stock: 15, image: null },
    { id: 4, name: 'Phanh Brembo', price: 3500000, stock: 8, image: null },
    { id: 5, name: 'Lọc gió Mann', price: 250000, stock: 30, image: null },
    { id: 6, name: 'Bugi NGK', price: 180000, stock: 100, image: null },
    { id: 7, name: 'Dây curoa Gates', price: 320000, stock: 25, image: null },
    { id: 8, name: 'Nước làm mát', price: 150000, stock: 40, image: null }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Slider Section */}
      <section style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: currentSlide === index ? 2 : 1
            }}
          >
            {/* Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1
            }}></div>
            
            {/* Content */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textAlign: 'center',
              padding: '0 1rem'
            }}>
              <div style={{ maxWidth: '800px' }}>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(14, 165, 233, 0.9)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  marginBottom: '2rem',
                  animation: currentSlide === index ? 'fadeInDown 1s ease-out' : 'none'
                }}>
                  {slide.badge}
                </div>
                
                <h1 style={{
                  fontSize: 'clamp(3rem, 8vw, 6rem)',
                  fontWeight: 800,
                  marginBottom: '1.5rem',
                  lineHeight: 1.1,
                  animation: currentSlide === index ? 'fadeInUp 1s ease-out 0.3s both' : 'none'
                }}>
                  {slide.title}
                </h1>
                
                <p style={{
                  fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                  marginBottom: '2.5rem',
                  opacity: 0.95,
                  lineHeight: 1.6,
                  animation: currentSlide === index ? 'fadeInUp 1s ease-out 0.6s both' : 'none'
                }}>
                  {slide.subtitle}
                </p>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  alignItems: 'center',
                  animation: currentSlide === index ? 'fadeInUp 1s ease-out 0.9s both' : 'none'
                }}>
                  {slide.buttons.map((button, btnIndex) => (
                    <Link
                      key={btnIndex}
                      to={button.link}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem 2rem',
                        borderRadius: '50px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        background: button.primary 
                          ? 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'
                          : 'transparent',
                        color: 'white',
                        border: button.primary ? 'none' : '2px solid white'
                      }}
                      onMouseOver={(e) => {
                        if (button.primary) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.4)';
                        } else {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.color = '#0ea5e9';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (button.primary) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        } else {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'white';
                        }
                      }}
                    >
                      <i className={button.icon}></i>
                      {button.text}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.25rem',
            zIndex: 10,
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.25rem',
            zIndex: 10,
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Dots */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 10
        }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          color: 'white',
          textAlign: 'center',
          fontSize: '12px',
          zIndex: 10,
          animation: 'bounce 2s infinite'
        }}>
          <span style={{ display: 'block', marginBottom: '0.5rem' }}>Cuộn xuống</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '4rem 0',
        background: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 700,
                  color: '#0ea5e9',
                  marginBottom: '0.5rem'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '5rem 0',
        background: '#f8fafc'
      }} id="about">
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Tại sao chọn MTProAuto?
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Chúng tôi cam kết mang đến trải nghiệm dịch vụ tốt nhất với những ưu điểm vượt trội
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  <i className={feature.icon}></i>
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '1rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#64748b',
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{
        padding: '5rem 0',
        background: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Dịch vụ nổi bật
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Các dịch vụ sửa chữa và bảo dưỡng ô tô chuyên nghiệp
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {services.slice(0, 6).map((service) => (
              <div key={service.id} style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#0ea5e9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: 'white'
                }}>
                  <i className="fas fa-tools"></i>
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '0.5rem'
                }}>
                  {service.name}
                </h3>
                <p style={{
                  color: '#64748b',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  lineHeight: 1.5
                }}>
                  {service.description}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#0ea5e9'
                  }}>
                    {formatCurrency(service.price)}
                  </span>
                  <Link to="/customer/services" style={{
                    color: '#0ea5e9',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    Đặt dịch vụ
                    <i className="fas fa-arrow-right" style={{ fontSize: '0.75rem' }}></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/customer/services" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              Xem tất cả dịch vụ
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section style={{
        padding: '5rem 0',
        background: '#f8fafc'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Sản phẩm chất lượng
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Phụ tùng và phụ kiện ô tô chính hãng, chất lượng cao
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {products.slice(0, 8).map((product) => (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  aspectRatio: '1',
                  background: '#f1f5f9',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <i className="fas fa-box" style={{
                      fontSize: '3rem',
                      color: '#94a3b8'
                    }}></i>
                  )}
                </div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '0.5rem',
                  lineHeight: 1.4
                }}>
                  {product.name}
                </h3>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#0ea5e9'
                  }}>
                    {formatCurrency(product.price)}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#64748b'
                  }}>
                    Còn {product.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/customer/products" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              Xem tất cả sản phẩm
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            Sẵn sàng trải nghiệm dịch vụ?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            opacity: 0.95,
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn và hỗ trợ tốt nhất
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <Link to="/customer/contact" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: 'white',
              color: '#0ea5e9',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              Liên hệ ngay
            </Link>
            <Link to="/customer/services" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              border: '2px solid white',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#0ea5e9';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'white';
            }}>
              Đặt dịch vụ
            </Link>
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
          
          @media (min-width: 640px) {
            .hero-buttons {
              flex-direction: row !important;
            }
          }
        `}
      </style>
    </div>
  );
};