import React, { useState } from 'react';

interface ContactFormData {
  hoTen: string;
  email: string;
  soDienThoai: string;
  chuDe: string;
  noiDung: string;
}

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    hoTen: '',
    email: '',
    soDienThoai: '',
    chuDe: '',
    noiDung: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      setFormData({
        hoTen: '',
        email: '',
        soDienThoai: '',
        chuDe: '',
        noiDung: ''
      });
    } catch (error) {
      console.error('Error sending contact:', error);
      alert('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Page Header */}
      <section style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        color: 'white',
        padding: '4rem 0 3rem',
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            marginBottom: '1rem'
          }}>
            Liên hệ với chúng tôi
          </h1>
          <p style={{
            fontSize: '1.25rem',
            opacity: 0.95
          }}>
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
          </p>
        </div>
      </section>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem 3rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {/* Form Section */}
          <div style={{
            gridColumn: 'span 2'
          }}>
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              padding: '2.5rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#1f2937',
                marginBottom: '1.5rem'
              }}>
                Gửi tin nhắn cho chúng tôi
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Họ và tên *
                    </label>
                    <input 
                      type="text" 
                      name="hoTen" 
                      placeholder="Nguyễn Văn A" 
                      value={formData.hoTen}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Email *
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="example@email.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Số điện thoại *
                    </label>
                    <input 
                      type="tel" 
                      name="soDienThoai" 
                      placeholder="0123456789" 
                      value={formData.soDienThoai}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Chủ đề
                    </label>
                    <select 
                      name="chuDe"
                      value={formData.chuDe}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="Tư vấn dịch vụ">Tư vấn dịch vụ</option>
                      <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
                      <option value="Khiếu nại">Khiếu nại</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Nội dung *
                  </label>
                  <textarea 
                    name="noiDung" 
                    rows={6}
                    placeholder="Hãy mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
                    value={formData.noiDung}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0.875rem 1rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    background: isSubmitting 
                      ? '#94a3b8' 
                      : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'white',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Contact Info Section */}
          <div>
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              padding: '2.5rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#1f2937',
                marginBottom: '1.5rem'
              }}>
                Thông tin liên hệ
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h6 style={{
                  fontWeight: 700,
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  Địa chỉ
                </h6>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: 1.6
                }}>
                  Ngã 4 An Dương Vương, Trần Phú, Quảng Ngãi
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h6 style={{
                  fontWeight: 700,
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  Điện thoại
                </h6>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: 1.6
                }}>
                  038 442 4567
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h6 style={{
                  fontWeight: 700,
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  Email
                </h6>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: 1.6
                }}>
                  contact@mtproauto.vn
                </p>
              </div>

              <div>
                <h6 style={{
                  fontWeight: 700,
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  Giờ làm việc
                </h6>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: 1.6
                }}>
                  Thứ 2 - Thứ 6: 8:00 - 18:00
                </p>
                <p style={{
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: 1.6
                }}>
                  Thứ 7 - Chủ nhật: 8:00 - 17:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};