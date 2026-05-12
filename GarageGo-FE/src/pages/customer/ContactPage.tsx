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

const TOPICS = [
  'Tư vấn dịch vụ',
  'Hỗ trợ kỹ thuật',
  'Báo giá',
  'Khiếu nại',
  'Khác',
];

const INFO = [
  {
    icon: 'fa-map-marker-alt',
    color: '#0ea5e9',
    title: 'Địa chỉ',
    value: 'Ngã 4 An Dương Vương, Trần Phú, Quảng Ngãi',
  },
  {
    icon: 'fa-phone-alt',
    color: '#22c55e',
    title: 'Hotline',
    value: '038 442 4567',
  },
  {
    icon: 'fa-envelope',
    color: '#8b5cf6',
    title: 'Email',
    value: 'contact@garagego.vn',
  },
  {
    icon: 'fa-clock',
    color: '#f59e0b',
    title: 'Giờ làm việc',
    value: 'T2–T6: 8:00–18:00 | T7–CN: 8:00–17:00',
  },
];

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState<ContactFormData>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactService.create(form);
      toast.success('Gửi tin nhắn thành công!');
      setForm(empty);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'white',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .ct-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
          padding: 5rem 0 7rem; position: relative; overflow: hidden;
        }
        .ct-hero::before {
          content: ''; position: absolute; inset: 0;
          background: url('https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg') center/cover;
          opacity: 0.08;
        }
        .ct-hero::after {
          content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 80px;
          background: #f8fafc; clip-path: ellipse(55% 100% at 50% 100%);
        }
        .ct-hero-inner { position: relative; max-width: 700px; margin: 0 auto; text-align: center; padding: 0 1.5rem; }
        .ct-tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; background: rgba(14,165,233,0.15); border: 1px solid rgba(14,165,233,0.3); color: #7dd3fc; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 16px; }
        .ct-hero h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: white; margin-bottom: 12px; }
        .ct-hero p { color: rgba(255,255,255,0.7); font-size: 1.05rem; line-height: 1.7; }

        .ct-body { max-width: 1100px; margin: -4rem auto 4rem; padding: 0 1.5rem; position: relative; z-index: 1; }
        .ct-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }

        /* Form card */
        .ct-form-card { background: white; border-radius: 24px; box-shadow: 0 8px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .ct-form-head { padding: 24px 28px; background: linear-gradient(135deg, #0f172a, #1e3a5f); }
        .ct-form-head h3 { margin: 0; color: white; font-size: 20px; font-weight: 800; }
        .ct-form-head p { margin: 6px 0 0; color: rgba(255,255,255,0.65); font-size: 13px; }
        .ct-form-body { padding: 28px; }
        .ct-field { margin-bottom: 18px; }
        .ct-label { display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.4px; }
        .ct-req { color: #ef4444; }

        /* Topic pills */
        .ct-topics { display: flex; flex-wrap: wrap; gap: 8px; }
        .ct-topic { padding: 7px 14px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: white; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .ct-topic.active { border-color: #0ea5e9; background: rgba(14,165,233,0.08); color: #0ea5e9; }
        .ct-topic:hover:not(.active) { border-color: #94a3b8; color: #374151; }

        /* Submit btn */
        .ct-submit { width: 100%; padding: 14px; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 20px rgba(14,165,233,0.35); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .ct-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(14,165,233,0.45); }
        .ct-submit:disabled { background: #94a3b8; box-shadow: none; cursor: not-allowed; transform: none; }

        /* Success */
        .ct-success { padding: 20px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 12px; border: 1px solid #86efac; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .ct-success-icon { width: 40px; height: 40px; border-radius: 50%; background: #22c55e; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        /* Info cards */
        .ct-info-stack { display: flex; flex-direction: column; gap: 14px; }
        .ct-info-card { background: white; border-radius: 16px; padding: 18px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; display: flex; align-items: center; gap: 14px; transition: all 0.2s; }
        .ct-info-card:hover { transform: translateX(4px); box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .ct-info-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .ct-info-title { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
        .ct-info-val { font-size: 14px; font-weight: 600; color: #1e293b; line-height: 1.4; }

        /* Map card */
        .ct-map-card { background: linear-gradient(135deg, #0f172a, #1e3a5f); border-radius: 16px; padding: 24px; text-align: center; position: relative; overflow: hidden; }
        .ct-map-card::before { content: ''; position: absolute; top: -30%; right: -20%; width: 200px; height: 200px; border-radius: 50%; background: rgba(14,165,233,0.15); }
        .ct-map-icon { font-size: 2.5rem; color: #0ea5e9; margin-bottom: 10px; display: block; position: relative; }
        .ct-map-title { font-weight: 800; color: white; margin-bottom: 4px; font-size: 15px; position: relative; }
        .ct-map-addr { font-size: 13px; color: rgba(255,255,255,0.6); position: relative; }

        @media (max-width: 800px) { .ct-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Hero */}
      <div className="ct-hero">
        <div className="ct-hero-inner">
          <div className="ct-tag">
            <i className="fas fa-headset" />
            Hỗ trợ 24/7
          </div>
          <h1>Liên hệ với chúng tôi</h1>
          <p>
            Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn. Hãy để lại tin nhắn và
            chúng tôi sẽ phản hồi sớm nhất.
          </p>
        </div>
      </div>

      <div className="ct-body">
        <div className="ct-grid">
          {/* Form */}
          <div className="ct-form-card">
            <div className="ct-form-head">
              <h3>
                <i
                  className="fas fa-paper-plane"
                  style={{ marginRight: '10px' }}
                />
                Gửi tin nhắn
              </h3>
              <p>
                Điền thông tin bên dưới, chúng tôi sẽ liên hệ trong vòng 24 giờ
              </p>
            </div>
            <div className="ct-form-body">
              {sent && (
                <div className="ct-success">
                  <div className="ct-success-icon">
                    <i
                      className="fas fa-check"
                      style={{ color: 'white', fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#15803d',
                        fontSize: '14px',
                      }}
                    >
                      Gửi thành công!
                    </div>
                    <div style={{ fontSize: '13px', color: '#16a34a' }}>
                      Chúng tôi sẽ liên hệ với bạn sớm nhất.
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div className="ct-field">
                    <label className="ct-label">
                      Họ và tên <span className="ct-req">*</span>
                    </label>
                    <input
                      style={inp}
                      type="text"
                      name="hoTen"
                      value={form.hoTen}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      required
                      onFocus={e => {
                        e.target.style.borderColor = '#0ea5e9';
                        e.target.style.boxShadow =
                          '0 0 0 3px rgba(14,165,233,0.1)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">
                      Email <span className="ct-req">*</span>
                    </label>
                    <input
                      style={inp}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                      onFocus={e => {
                        e.target.style.borderColor = '#0ea5e9';
                        e.target.style.boxShadow =
                          '0 0 0 3px rgba(14,165,233,0.1)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div className="ct-field">
                  <label className="ct-label">
                    Số điện thoại <span className="ct-req">*</span>
                  </label>
                  <input
                    style={inp}
                    type="tel"
                    name="soDienThoai"
                    value={form.soDienThoai}
                    onChange={handleChange}
                    placeholder="0901 234 567"
                    required
                    onFocus={e => {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.boxShadow =
                        '0 0 0 3px rgba(14,165,233,0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div className="ct-field">
                  <label className="ct-label">Chủ đề</label>
                  <div className="ct-topics">
                    {TOPICS.map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`ct-topic ${form.chuDe === t ? 'active' : ''}`}
                        onClick={() => setForm(f => ({ ...f, chuDe: t }))}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ct-field">
                  <label className="ct-label">
                    Nội dung <span className="ct-req">*</span>
                  </label>
                  <textarea
                    style={{ ...inp, resize: 'vertical', minHeight: '120px' }}
                    name="noiDung"
                    value={form.noiDung}
                    onChange={handleChange}
                    placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
                    required
                    rows={5}
                    onFocus={e => {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.boxShadow =
                        '0 0 0 3px rgba(14,165,233,0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="ct-submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" />
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info */}
          <div className="ct-info-stack">
            {INFO.map(item => (
              <div key={item.icon} className="ct-info-card">
                <div
                  className="ct-info-icon"
                  style={{ background: `${item.color}15`, color: item.color }}
                >
                  <i className={`fas ${item.icon}`} />
                </div>
                <div>
                  <div className="ct-info-title">{item.title}</div>
                  <div className="ct-info-val">{item.value}</div>
                </div>
              </div>
            ))}

            <div className="ct-map-card">
              <i className="fas fa-map-marked-alt ct-map-icon" />
              <div className="ct-map-title">Tìm chúng tôi trên bản đồ</div>
              <div className="ct-map-addr">
                Ngã 4 An Dương Vương, Quảng Ngãi
              </div>
              <div
                style={{
                  marginTop: '14px',
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {[
                  { icon: 'fa-facebook-f', color: '#1877f2' },
                  { icon: 'fa-youtube', color: '#ff0000' },
                  { icon: 'fa-tiktok', color: '#010101' },
                ].map(s => (
                  <a
                    key={s.icon}
                    href="#"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={e => {
                      (e.currentTarget as HTMLElement).style.background =
                        s.color;
                      (e.currentTarget as HTMLElement).style.color = 'white';
                    }}
                    onMouseOut={e => {
                      (e.currentTarget as HTMLElement).style.background =
                        'rgba(255,255,255,0.1)';
                      (e.currentTarget as HTMLElement).style.color =
                        'rgba(255,255,255,0.8)';
                    }}
                  >
                    <i className={`fab ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
