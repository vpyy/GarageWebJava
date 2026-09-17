import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../../store/slices/authSlice';

interface LoginForm {
  username: string;
  password: string;
}

const schema = yup.object({
  username: yup.string().required('Tên đăng nhập là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc'),
});

// Ảnh xe thật — Porsche 911 GT3 chụp ngoài trời
const CAR_BG =
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=90';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: yupResolver(schema) as any });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    dispatch(loginStart());
    try {
      const response = await authService.login(data);
      const user = {
        userId: response.userId,
        username: response.username,
        email: response.email,
        role: response.role,
      };
      const token = response.accessToken || response.token || '';
      dispatch(loginSuccess({ user, token }));
      if (response.refreshToken)
        localStorage.setItem('refreshToken', response.refreshToken);
      toast.success('Đăng nhập thành công!');
      if (response.role === 'Admin') navigate('/admin/dashboard');
      else navigate('/customer/home');
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Tên đăng nhập hoặc mật khẩu không đúng';
      dispatch(loginFailure(msg));
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: '#0a0f1e',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(14,165,233,0.5); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 10px rgba(14,165,233,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(14,165,233,0); }
        }

        .login-page-wrap { animation: fadeIn 0.5s ease; }

        /* Input */
        .login-inp {
          width: 100%;
          padding: 13px 16px 13px 46px;
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          background: rgba(255,255,255,0.05);
          box-sizing: border-box;
          color: #f1f5f9;
        }
        .login-inp:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.18);
          background: rgba(255,255,255,0.08);
        }
        .login-inp::placeholder { color: rgba(255,255,255,0.3); }

        /* Button */
        .login-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #06b6d4 100%);
          background-size: 200% auto;
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(14,165,233,0.4);
          letter-spacing: 0.3px;
        }
        .login-btn:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(14,165,233,0.55);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled {
          background: rgba(255,255,255,0.1);
          box-shadow: none;
          cursor: not-allowed;
          color: rgba(255,255,255,0.4);
        }

        /* Icon inside input */
        .inp-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          font-size: 14px;
          pointer-events: none;
          transition: color 0.2s;
        }
        .inp-wrap:focus-within .inp-icon { color: #0ea5e9; }

        /* Label */
        .login-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* Error */
        .login-err {
          color: #f87171;
          font-size: 12px;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* Divider */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
        }
        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        /* Demo card */
        .demo-card {
          padding: 8px 12px;
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          transition: all 0.2s;
        }
        .demo-card:hover {
          background: rgba(14,165,233,0.1);
          border-color: rgba(14,165,233,0.3);
        }

        /* Stat badge */
        .stat-badge {
          padding: 14px 20px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          text-align: center;
          transition: all 0.2s;
        }
        .stat-badge:hover {
          background: rgba(14,165,233,0.12);
          border-color: rgba(14,165,233,0.3);
          transform: translateY(-2px);
        }

        /* Feature pill */
        .feature-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
        }

        @media (max-width: 900px) {
          .login-left  { display: none !important; }
          .login-right { width: 100% !important; min-width: unset !important; }
        }
      `}</style>

      <div
        className="login-page-wrap"
        style={{ display: 'flex', width: '100%' }}
      >
        {/* ══════════════════════════════════════
            LEFT — Ảnh xe thật + branding
        ══════════════════════════════════════ */}
        <div
          className="login-left"
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            minHeight: '100vh',
          }}
        >
          {/* Ảnh xe thật */}
          <img
            src={CAR_BG}
            alt="Luxury sports car"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 55%',
            }}
          />

          {/* Gradient overlay — tối hơn ở trên/dưới, trong suốt ở giữa */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(
                  to bottom,
                  rgba(10,15,30,0.92) 0%,
                  rgba(10,15,30,0.45) 35%,
                  rgba(10,15,30,0.45) 65%,
                  rgba(10,15,30,0.95) 100%
                )
              `,
            }}
          />

          {/* Accent glow */}
          <div
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '-10%',
              width: '60%',
              height: '40%',
              background:
                'radial-gradient(ellipse, rgba(14,165,233,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '36px 44px',
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(14,165,233,0.4)',
                  animation: 'pulse-ring 2.5s ease-in-out infinite',
                }}
              >
                <i
                  className="fas fa-car-side"
                  style={{ color: 'white', fontSize: '19px' }}
                />
              </div>
              <div>
                <div
                  style={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '18px',
                    lineHeight: 1.1,
                  }}
                >
                  MTProAuto
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: '11px',
                    letterSpacing: '1px',
                  }}
                >
                  GARAGE MANAGEMENT
                </div>
              </div>
            </div>

            {/* Bottom content */}
            <div style={{ animation: 'fadeUp 0.9s ease' }}>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  background: 'rgba(14,165,233,0.15)',
                  border: '1px solid rgba(14,165,233,0.35)',
                  color: '#7dd3fc',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '1.8px',
                  marginBottom: '18px',
                }}
              >
                <i className="fas fa-certificate" style={{ fontSize: '9px' }} />
                PREMIUM AUTO SERVICE
              </div>

              {/* Headline */}
              <h2
                style={{
                  fontSize: 'clamp(2rem, 2.8vw, 3rem)',
                  fontWeight: 900,
                  color: 'white',
                  lineHeight: 1.12,
                  marginBottom: '16px',
                  letterSpacing: '-0.5px',
                }}
              >
                Chăm sóc xe hơi
                <br />
                <span
                  style={{
                    background:
                      'linear-gradient(90deg, #38bdf8, #06b6d4, #0ea5e9)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmer 3s linear infinite',
                  }}
                >
                  đẳng cấp chuyên nghiệp
                </span>
              </h2>

              <p
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '15px',
                  lineHeight: 1.75,
                  maxWidth: '400px',
                  marginBottom: '32px',
                }}
              >
                Đội ngũ kỹ thuật viên được chứng nhận quốc tế, trang thiết bị
                hiện đại. Cam kết chất lượng — hài lòng 100%.
              </p>

              {/* Features */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginBottom: '32px',
                }}
              >
                {[
                  { icon: 'fa-tools', text: 'Sửa chữa & bảo dưỡng chuyên sâu' },
                  {
                    icon: 'fa-shield-check',
                    text: 'Phụ tùng chính hãng, bảo hành dài hạn',
                  },
                  {
                    icon: 'fa-clock',
                    text: 'Đặt lịch linh hoạt, giao xe đúng hẹn',
                  },
                ].map(f => (
                  <div key={f.icon} className="feature-pill">
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background:
                          'linear-gradient(135deg, rgba(14,165,233,0.3), rgba(6,182,212,0.2))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <i
                        className={`fas ${f.icon}`}
                        style={{ color: '#38bdf8', fontSize: '12px' }}
                      />
                    </div>
                    <span
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '13px',
                      }}
                    >
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { val: '2,500+', label: 'Khách hàng tin tùng' },
                  { val: '8,000+', label: 'Xe đã phục vụ' },
                  { val: '4.9 ★', label: 'Điểm đánh giá' },
                ].map(s => (
                  <div key={s.label} className="stat-badge" style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '1.3rem',
                        fontWeight: 900,
                        color: 'white',
                        lineHeight: 1.2,
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.5)',
                        marginTop: '3px',
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT — Form đăng nhập
        ══════════════════════════════════════ */}
        <div
          className="login-right"
          style={{
            width: '480px',
            minWidth: '480px',
            background: '#0d1526',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '52px 48px',
            overflowY: 'auto',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ animation: 'fadeUp 0.6s ease' }}>
            {/* Header */}
            <div style={{ marginBottom: '38px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '22px',
                  boxShadow: '0 8px 24px rgba(14,165,233,0.35)',
                }}
              >
                <i
                  className="fas fa-sign-in-alt"
                  style={{ color: 'white', fontSize: '22px' }}
                />
              </div>
              <h1
                style={{
                  fontSize: '30px',
                  fontWeight: 900,
                  color: '#f1f5f9',
                  marginBottom: '8px',
                  letterSpacing: '-0.5px',
                }}
              >
                Chào mừng trở lại 👋
              </h1>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.6,
                }}
              >
                Đăng nhập để tiếp tục quản lý và sử dụng dịch vụ
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Username */}
              <div style={{ marginBottom: '20px' }}>
                <label className="login-label">Tên đăng nhập</label>
                <div className="inp-wrap" style={{ position: 'relative' }}>
                  <i className="fas fa-user inp-icon" />
                  <input
                    {...register('username')}
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    className="login-inp"
                  />
                </div>
                {errors.username && (
                  <div className="login-err">
                    <i className="fas fa-exclamation-circle" />
                    {errors.username.message}
                  </div>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '14px' }}>
                <label className="login-label">Mật khẩu</label>
                <div className="inp-wrap" style={{ position: 'relative' }}>
                  <i className="fas fa-lock inp-icon" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    className="login-inp"
                    style={{ paddingRight: '46px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.3)',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s',
                    }}
                    tabIndex={-1}
                  >
                    <i
                      className={
                        showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                      }
                      style={{ fontSize: '14px' }}
                    />
                  </button>
                </div>
                {errors.password && (
                  <div className="login-err">
                    <i className="fas fa-exclamation-circle" />
                    {errors.password.message}
                  </div>
                )}
              </div>

              {/* Forgot */}
              <div style={{ textAlign: 'right', marginBottom: '28px' }}>
                <a
                  href="#"
                  style={{
                    color: '#38bdf8',
                    fontSize: '13px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    opacity: 0.85,
                    transition: 'opacity 0.2s',
                  }}
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="login-btn"
              >
                {isSubmitting ? (
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
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt" />
                    Đăng nhập
                  </>
                )}
              </button>

              {/* Register link */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '22px',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/auth/register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  Đăng ký ngay →
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="login-divider">
              <span
                style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.25)',
                  whiteSpace: 'nowrap',
                }}
              >
                TÀI KHOẢN DEMO
              </span>
            </div>

            {/* Demo accounts */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              {[
                {
                  role: 'Admin',
                  user: 'admin',
                  icon: 'fa-shield-alt',
                  color: '#a78bfa',
                  bg: 'rgba(167,139,250,0.1)',
                  border: 'rgba(167,139,250,0.2)',
                },
                {
                  role: 'Customer',
                  user: 'customer',
                  icon: 'fa-user',
                  color: '#38bdf8',
                  bg: 'rgba(56,189,248,0.1)',
                  border: 'rgba(56,189,248,0.2)',
                },
              ].map(a => (
                <div
                  key={a.role}
                  className="demo-card"
                  style={{ borderColor: a.border, background: a.bg }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      marginBottom: '4px',
                    }}
                  >
                    <i
                      className={`fas ${a.icon}`}
                      style={{ color: a.color, fontSize: '11px' }}
                    />
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: a.color,
                      }}
                    >
                      {a.role}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.4)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {a.user} / 123456
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
