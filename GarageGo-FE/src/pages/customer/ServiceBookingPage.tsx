import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import toast from 'react-hot-toast';

interface Service {
  maDV?: number;
  id?: number;
  tenDV?: string;
  donGia?: number;
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

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    n
  );

const ServiceBookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: info, 2: confirm
  const [form, setForm] = useState<BookingForm>({
    tenKhachHang: '',
    soDienThoai: '',
    diaChi: '',
    ngayHen: '',
    gioHen: '',
    ghiChu: '',
  });

  useEffect(() => {
    fetch(`/api/dich-vu/${id}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (d) setService(d);
        else navigate('/customer/services');
      })
      .catch(() => navigate('/customer/services'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/yeu-cau', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          ...form,
          maDV: service?.maDV || service?.id || parseInt(id!),
          username: user?.username,
        }),
      });
      if (res.ok) {
        toast.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ sớm nhất.');
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

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
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
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid #e2e8f0',
              borderTopColor: '#0ea5e9',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Đang tải...</div>
        </div>
      </div>
    );

  if (!service) return null;

  const name = service.tenDV || '';
  const price = service.donGia || 0;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .sb-hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 3rem 0 5rem; position: relative; overflow: hidden; }
        .sb-hero::before { content: ''; position: absolute; inset: 0; background: url('${service.hinhAnh}') center/cover; opacity: 0.1; }
        .sb-body { max-width: 900px; margin: -3rem auto 3rem; padding: 0 1.5rem; position: relative; z-index: 1; }
        .sb-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
        .sb-card { background: white; border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden; }
        .sb-card-head { padding: 18px 22px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px; }
        .sb-card-title { font-size: 15px; font-weight: 700; color: #1e293b; }
        .sb-step-num { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .sb-card-body { padding: 22px; }
        .sb-field { margin-bottom: 16px; }
        .sb-label { display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px; }
        .sb-submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 20px rgba(14,165,233,0.35); }
        .sb-submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(14,165,233,0.45); }
        .sb-submit-btn:disabled { background: #94a3b8; box-shadow: none; cursor: not-allowed; transform: none; }
        .sb-back-btn { width: 100%; padding: 12px; background: white; color: #64748b; border: 1.5px solid #e5e7eb; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 10px; transition: all 0.2s; }
        .sb-back-btn:hover { border-color: #0ea5e9; color: #0ea5e9; }

        /* Service info card */
        .sb-info-card { background: white; border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden; position: sticky; top: 88px; }
        .sb-info-img { height: 180px; overflow: hidden; }
        .sb-info-img img { width: 100%; height: 100%; object-fit: cover; }
        .sb-info-body { padding: 18px; }
        .sb-info-name { font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 6px; }
        .sb-info-desc { font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .sb-info-price { font-size: 22px; font-weight: 900; color: #0ea5e9; margin-bottom: 14px; }
        .sb-info-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; margin-bottom: 8px; }
        .sb-info-row i { width: 16px; color: #0ea5e9; }

        /* Steps */
        .sb-steps { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .sb-step { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; }
        .sb-step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }
        .sb-step-line { flex: 1; height: 2px; background: #e2e8f0; }

        /* Confirm */
        .sb-confirm-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f8fafc; font-size: 14px; }
        .sb-confirm-label { color: #94a3b8; font-weight: 500; }
        .sb-confirm-val { color: #1e293b; font-weight: 600; text-align: right; max-width: 60%; }

        @media (max-width: 700px) { .sb-grid { grid-template-columns: 1fr; } .sb-info-card { position: static; } }
      `}</style>

      {/* Hero */}
      <div className="sb-hero">
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 1.5rem',
            position: 'relative',
          }}
        >
          <button
            onClick={() => navigate('/customer/services')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            <i className="fas fa-arrow-left" />
            Quay lại
          </button>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              color: 'white',
              margin: '0 0 6px',
            }}
          >
            Đặt lịch dịch vụ
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: '14px',
              margin: 0,
            }}
          >
            {name}
          </p>
        </div>
      </div>

      <div className="sb-body">
        {/* Steps indicator */}
        <div className="sb-steps" style={{ marginBottom: '20px' }}>
          {[
            { n: 1, label: 'Thông tin' },
            { n: 2, label: 'Xác nhận' },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="sb-step">
                <div
                  className="sb-step-dot"
                  style={{
                    background:
                      step >= s.n
                        ? 'linear-gradient(135deg, #0ea5e9, #06b6d4)'
                        : '#e2e8f0',
                    color: step >= s.n ? 'white' : '#94a3b8',
                  }}
                >
                  {step > s.n ? (
                    <i className="fas fa-check" style={{ fontSize: '10px' }} />
                  ) : (
                    s.n
                  )}
                </div>
                <span style={{ color: step >= s.n ? '#0ea5e9' : '#94a3b8' }}>
                  {s.label}
                </span>
              </div>
              {i < 1 && (
                <div
                  className="sb-step-line"
                  style={{ background: step > 1 ? '#0ea5e9' : '#e2e8f0' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="sb-grid">
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="sb-card">
                <div className="sb-card-head">
                  <div className="sb-step-num">1</div>
                  <div className="sb-card-title">Thông tin đặt lịch</div>
                </div>
                <div className="sb-card-body">
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <div className="sb-field">
                      <label className="sb-label">
                        Họ và tên <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        style={inp}
                        type="text"
                        value={form.tenKhachHang}
                        onChange={e =>
                          setForm({ ...form, tenKhachHang: e.target.value })
                        }
                        placeholder="Nguyễn Văn A"
                        required
                        onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                        onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                      />
                    </div>
                    <div className="sb-field">
                      <label className="sb-label">
                        Số điện thoại{' '}
                        <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        style={inp}
                        type="tel"
                        value={form.soDienThoai}
                        onChange={e =>
                          setForm({ ...form, soDienThoai: e.target.value })
                        }
                        placeholder="0901 234 567"
                        required
                        onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                        onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                      />
                    </div>
                  </div>
                  <div className="sb-field">
                    <label className="sb-label">
                      Địa chỉ <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      style={{ ...inp, resize: 'none' }}
                      rows={2}
                      value={form.diaChi}
                      onChange={e =>
                        setForm({ ...form, diaChi: e.target.value })
                      }
                      placeholder="Số nhà, tên đường, phường/xã..."
                      required
                      onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                      onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                    />
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <div className="sb-field">
                      <label className="sb-label">
                        Ngày hẹn <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        style={inp}
                        type="date"
                        value={form.ngayHen}
                        onChange={e =>
                          setForm({ ...form, ngayHen: e.target.value })
                        }
                        min={new Date().toISOString().split('T')[0]}
                        required
                        onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                        onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                      />
                    </div>
                    <div className="sb-field">
                      <label className="sb-label">
                        Giờ hẹn <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        style={inp}
                        type="time"
                        value={form.gioHen}
                        onChange={e =>
                          setForm({ ...form, gioHen: e.target.value })
                        }
                        required
                        onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                        onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                      />
                    </div>
                  </div>
                  <div className="sb-field" style={{ marginBottom: 0 }}>
                    <label className="sb-label">
                      Ghi chú về xe / yêu cầu đặc biệt
                    </label>
                    <textarea
                      style={{ ...inp, resize: 'none' }}
                      rows={3}
                      value={form.ghiChu}
                      onChange={e =>
                        setForm({ ...form, ghiChu: e.target.value })
                      }
                      placeholder="Mô tả vấn đề của xe hoặc yêu cầu đặc biệt..."
                      onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                      onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                    />
                  </div>
                </div>
                <div style={{ padding: '0 22px 22px' }}>
                  <button type="submit" className="sb-submit-btn">
                    Tiếp theo <i className="fas fa-arrow-right ms-2" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="sb-card">
                <div className="sb-card-head">
                  <div className="sb-step-num">2</div>
                  <div className="sb-card-title">Xác nhận thông tin</div>
                </div>
                <div className="sb-card-body">
                  <div
                    style={{
                      background: '#f0f9ff',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '16px',
                      border: '1px solid #bae6fd',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#0369a1',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Thông tin đặt lịch
                    </div>
                    {[
                      ['Dịch vụ', name],
                      ['Họ và tên', form.tenKhachHang],
                      ['Số điện thoại', form.soDienThoai],
                      ['Địa chỉ', form.diaChi],
                      ['Ngày hẹn', form.ngayHen],
                      ['Giờ hẹn', form.gioHen],
                      form.ghiChu ? ['Ghi chú', form.ghiChu] : null,
                    ]
                      .filter(Boolean)
                      .map((row: any) => (
                        <div key={row[0]} className="sb-confirm-row">
                          <span className="sb-confirm-label">{row[0]}</span>
                          <span className="sb-confirm-val">{row[1]}</span>
                        </div>
                      ))}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        marginTop: '4px',
                        borderTop: '2px solid #bae6fd',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: '#0369a1',
                          fontSize: '15px',
                        }}
                      >
                        Giá tham khảo
                      </span>
                      <span
                        style={{
                          fontWeight: 900,
                          color: '#0ea5e9',
                          fontSize: '20px',
                        }}
                      >
                        {fmt(price)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="sb-submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: 'white',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            marginRight: '8px',
                            verticalAlign: 'middle',
                          }}
                        />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2" />
                        Xác nhận đặt lịch
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="sb-back-btn"
                    onClick={() => setStep(1)}
                  >
                    <i className="fas fa-arrow-left me-2" />
                    Quay lại chỉnh sửa
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Service info */}
          <div className="sb-info-card">
            <div className="sb-info-img">
              <img
                src={
                  service.hinhAnh ||
                  'https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg'
                }
                alt={name}
              />
            </div>
            <div className="sb-info-body">
              <div className="sb-info-name">{name}</div>
              <div className="sb-info-desc">{service.moTa}</div>
              <div className="sb-info-price">{fmt(price)}</div>
              <div className="sb-info-row">
                <i className="fas fa-phone-alt" />
                038 442 4567
              </div>
              <div className="sb-info-row">
                <i className="fas fa-map-marker-alt" />
                Ngã 4 An Dương Vương, Quảng Ngãi
              </div>
              <div className="sb-info-row">
                <i className="fas fa-clock" />
                T2–T7: 7:30 – 17:30
              </div>
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px',
                  background: '#f0fdf4',
                  borderRadius: '10px',
                }}
              >
                {[
                  { icon: 'fa-shield-alt', text: 'Bảo hành dịch vụ' },
                  {
                    icon: 'fa-certificate',
                    text: 'Kỹ thuật viên được chứng nhận',
                  },
                  { icon: 'fa-tag', text: 'Giá cả minh bạch' },
                ].map(p => (
                  <div
                    key={p.icon}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      fontSize: '12px',
                      color: '#16a34a',
                      marginBottom: '6px',
                    }}
                  >
                    <i className={`fas ${p.icon}`} />
                    {p.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingPage;
