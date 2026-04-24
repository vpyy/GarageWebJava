import React, { useState } from 'react';
import { contactService } from '../../services/contactService';
import toast from 'react-hot-toast';

interface ContactFormData {
  hoTen: string;
  email: string;
  soDienThoai: string;
  chuDe: string;
  noiDung: string;
}

const empty: ContactFormData = {
  hoTen: '',
  email: '',
  soDienThoai: '',
  chuDe: '',
  noiDung: '',
};

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>(empty);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await contactService.create({
        hoTen: formData.hoTen,
        email: formData.email,
        soDienThoai: formData.soDienThoai,
        chuDe: formData.chuDe,
        noiDung: formData.noiDung,
      });
      toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      setFormData(empty);
    } catch {
      toast.error('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls: React.CSSProperties = {
    width: '100%',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelCls: React.CSSProperties = {
    display: 'block',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '0.5rem',
    fontSize: '14px',
  };

  const infoItems = [
    { icon: 'fa-map-marker-alt', title: 'Địa chỉ', text: 'Ngã 4 An Dương Vương, Trần Phú, Quảng Ngãi' },
    { icon: 'fa-phone-alt', title: 'Hotline', text: '038 442 4567' },
    { icon: 'fa-envelope', title: 'Email', text: 'contact@garagego.vn' },
    { icon: 'fa-clock', title: 'Giờ làm việc', text: 'T2–T6: 8:00–18:00 | T7–CN: 8:00–17:00' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
          color: 'white', padding: '4rem 0 3rem', textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Liên hệ với chúng tôi
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn 24/7
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

          {/* Form */}
          <div
            style={{
              background: 'white', border: '1px solid #e2e8f0',
              borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              padding: '2.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1f2937', marginBottom: '1.5rem' }}>
              <i className="fas fa-paper-plane me-2" style={{ color: '#0ea5e9' }} />
              Gửi tin nhắn cho chúng tôi
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelCls}>Họ và tên <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    style={inputCls} type="text" name="hoTen"
                    placeholder="Nguyễn Văn A" value={formData.hoTen}
                    onChange={handleChange} required
                    onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                    onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>
                <div>
                  <label style={labelCls}>Email <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    style={inputCls} type="email" name="email"
                    placeholder="example@email.com" value={formData.email}
                    onChange={handleChange} required
                    onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                    onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelCls}>Số điện thoại <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    style={inputCls} type="tel" name="soDienThoai"
                    placeholder="0123456789" value={formData.soDienThoai}
                    onChange={handleChange} required
                    onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                    onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>
                <div>
                  <label style={labelCls}>Chủ đề</label>
                  <select
                    style={inputCls} name="chuDe"
                    value={formData.chuDe} onChange={handleChange}
                    onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                    onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
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
                <label style={labelCls}>Nội dung <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea
                  style={{ ...inputCls, resize: 'vertical' }} name="noiDung" rows={5}
                  placeholder="Hãy mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
                  value={formData.noiDung} onChange={handleChange} required
                  onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>

              <button
                type="submit" disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  border: 'none', borderRadius: '12px',
                  padding: '1rem 2rem', fontSize: '1rem',
                  fontWeight: 700, color: 'white',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(14,165,233,0.3)',
                }}
              >
                {isSubmitting ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Đang gửi...</>
                ) : (
                  <><i className="fas fa-paper-plane me-2" />Gửi tin nhắn</>
                )}
              </button>
            </form>
          </div>

          {/* Thông tin liên hệ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {infoItems.map(item => (
              <div
                key={item.icon}
                style={{
                  background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: '16px', padding: '1.25rem 1.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <i className={`fas ${item.icon}`} style={{ color: 'white', fontSize: '18px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#1f2937', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.5 }}>{item.text}</div>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                border: '1px solid #bae6fd', borderRadius: '16px',
                padding: '1.5rem', textAlign: 'center',
              }}
            >
              <i className="fas fa-map-marked-alt" style={{ fontSize: '2.5rem', color: '#0ea5e9', marginBottom: '8px', display: 'block' }} />
              <div style={{ fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>Bản đồ</div>
              <div style={{ fontSize: '13px', color: '#0284c7' }}>Ngã 4 An Dương Vương, Quảng Ngãi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
