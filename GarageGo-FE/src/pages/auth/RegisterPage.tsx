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

interface RegisterForm {
  username: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object({
  username: yup.string().required('Tên đăng nhập là bắt buộc'),
  email: yup.string().email('Email không hợp lệ'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

// Ảnh xe thật — BMW M4 Competition màu xanh dương
const CAR_BG =
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1400&q=90';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: yupResolver(schema) as any });

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    dispatch(loginStart());
    try {
      const response = await authService.register(data);
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
      toast.success('Đăng ký thành công!');
      navigate('/customer/home');
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra khi đăng ký!';
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
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }

        .reg-page-wrap { animation: fadeIn 0.5s ease; }

        /* Input */
        .reg-inp {
          width: 100%;
          padding: 12px 16px 12px 46px;
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
        .reg-inp:focus {
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6,182,212,0.18);
          background: rgba(255,255,255,0.08);
        }
        .reg-inp::placeholder { color: rgba(255,255,255,0.3); }

        /* Button */
        .reg-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 50%, #0284c7 100%);
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
          box-shadow: 0 4px 20px rgba(6,182,212,0.4);
          letter-spacing: 0.3px;
        }
        .reg-btn:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(6,182,212,0.55);
        }
        .reg-btn:active:not(:disabled) { transform: translateY(0); }
        .reg-btn:disabled {
          background: rgba(255,255,255,0.1);
          box-shadow: none;
          cursor: not-allowed;
          color: rgba(255,255,255,0.4);
        }

        /* Icon inside input */
        .reg-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          font-size: 14px;
          pointer-events: none;
          transition: color 0.2s;
        }
        .reg-inp-wrap:focus-within .reg-icon { color: #06b6d4; }

        /* Label */
        .reg-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* Error */
        .reg-err {
          color: #f87171;
          font-size: 12px;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* Benefit item */
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.04);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.2s;
        }
        .benefit-item:hover {
          background: rgba(6,182,212,0.08);
          border-color: rgba(6,182,212,0.2);
          transform: translateX(4px);
        }

        /* Step indicator */
        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: all 0.3s;
        }
        .step-dot.active {
          background: #06b6d4;
          box-shadow: 0 0 8px rgba(6,182,212,0.6);
        }

        @media (max-width: 900px) {
          .reg-left  { display: none !important; }
          .reg-right { width: 100% !important; min-width: unset !important; }
        }
      `}</style>

      <div className="reg-page-wrap" style={{ display: 'flex', width: '100%' }}>

        {/* ══════════════════════════════════════
            LEFT — Ảnh xe thật + benefits
        ══════════════════════════════════════ */}
        <div
          className="reg-left"
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
            alt="BMW M4 Competition"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(
                  to bottom,
                  rgba(10,15,30,0.94) 0%,
                  rgba(10,15,30,0.4)  35%,
                  rgba(10,15,30,0.4)  60%,
                  rgba(10,15,30,0.97) 100%
                )
              `,
            }}
          />

          {/* Cyan accent glow */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              right: '-5%',
              width: '50%',
              height: '50%',
              background: 'radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)',
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
                  background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(6,182,212,0.4)',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <i className="fas fa-car-side" style={{ color: 'white', fontSize: '19px' }} />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '18px', lineHeight: 1.1 }}>
                  MTProAuto
                </div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', letterSpacing: '1px' }}>
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
                  background: 'rgba(6,182,212,0.15)',
                  border: '1px solid rgba(6,182,212,0.35)',
                  color: '#67e8f9',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '1.8px',
                  marginBottom: '18px',
                }}
              >
                <i className="fas fa-gift" style={{ fontSize: '9px' }} />
                ƯU ĐÃI KHÁCH HÀNG MỚI
              </div>

              {/* Headline */}
              <h2
                style={{
                  fontSize: 'clamp(1.9rem, 2.8vw, 2.8rem)',
                  fontWeight: 900,
                  color: 'white',
                  lineHeight: 1.12,
                  marginBottom: '16px',
                  letterSpacing: '-0.5px',
                }}
              >
                Tham gia cùng
                <br />
                <span
                  style={{
                    background: 'linear-gradient(90deg, #67e8f9, #06b6d4, #38bdf8)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmer 3s linear infinite',
                  }}
                >
                  2,500+ khách hàng
                </span>
              </h2>

              <p
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '15px',
                  lineHeight: 1.75,
                  maxWidth: '400px',
                  marginBottom: '28px',
                }}
              >
                Đăng ký ngay để nhận ưu đãi đặc biệt và trải nghiệm dịch vụ
                bảo dưỡng xe hơi chuyên nghiệp hàng đầu.
              </p>

              {/* Benefits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { icon: 'fa-calendar-check', color: '#34d399', text: 'Đặt lịch dịch vụ trực tuyến 24/7' },
                  { icon: 'fa-shopping-bag',   color: '#fbbf24', text: 'Mua phụ tùng chính hãng giá tốt nhất' },
                  { icon: 'fa-history',        color: '#a78bfa', text: 'Theo dõi toàn bộ lịch sử bảo dưỡng' },
                  { icon: 'fa-headset',        color: '#38bdf8', text: 'Hỗ trợ khách hàng tận tâm 24/7' },
                ].map(b => (
                  <div key={b.icon} className="benefit-item">
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '9px',
                        background: `${b.color}18`,
                        border: `1px solid ${b.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <i className={`fas ${b.icon}`} style={{ color: b.color, fontSize: '13px' }} />
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                      {b.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT — Form đăng ký
        ══════════════════════════════════════ */}
        <div
          className="reg-right"
          style={{
            width: '500px',
            minWidth: '500px',
            background: '#0d1526',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px 48px',
            overflowY: 'auto',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ animation: 'fadeUp 0.6s ease' }}>

            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 8px 24px rgba(6,182,212,0.35)',
                }}
              >
                <i className="fas fa-user-plus" style={{ color: 'white', fontSize: '22px' }} />
              </div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: '#f1f5f9',
                  marginBottom: '8px',
                  letterSpacing: '-0.5px',
                }}
              >
                Tạo tài khoản mới ✨
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                Điền thông tin bên dưới để bắt đầu hành trình cùng MTProAuto
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Username */}
              <div style={{ marginBottom: '16px' }}>
                <label className="reg-label">
                  Tên đăng nhập <span style={{ color: '#f87171' }}>*</span>
                </label>
                <div className="reg-inp-wrap" style={{ position: 'relative' }}>
                  <i className="fas fa-user reg-icon" />
                  <input
                    {...register('username')}
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    className="reg-inp"
                  />
                </div>
                {errors.username && (
                  <div className="reg-err">
                    <i className="fas fa-exclamation-circle" />
                    {errors.username.message}
                  </div>
                )}
              </div>

              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label className="reg-label">
                  Email{' '}
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                    (tùy chọn)
                  </span>
                </label>
                <div className="reg-inp-wrap" style={{ position: 'relative' }}>
                  <i className="fas fa-envelope reg-icon" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="example@email.com"
                    className="reg-inp"
                  />
                </div>
                {errors.email && (
                  <div className="reg-err">
                    <i className="fas fa-exclamation-circle" />
                    {errors.email.message}
                  </div>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '16px' }}>
                <label className="reg-label">
                  Mật khẩu <span style={{ color: '#f87171' }}>*</span>
                </label>
                <div className="reg-inp-wrap" style={{ position: 'relative' }}>
                  <i className="fas fa-lock reg-icon" />
                  <input
                    {...register('password')}
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Ít nhất 6 ký tự"
                    className="reg-inp"
                    style={{ paddingRight: '46px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
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
                      fontFamily: 'inherit',
                    }}
                    tabIndex={-1}
                  >
                    <i
                      className={showPwd ? 'fas fa-eye-slash' : 'fas fa-eye'}
                      style={{ fontSize: '14px' }}
                    />
                  </button>
                </div>
                {errors.password && (
                  <div className="reg-err">
                    <i className="fas fa-exclamation-circle" />
                    {errors.password.message}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '26px' }}>
                <label className="reg-label">
                  Xác nhận mật khẩu <span style={{ color: '#f87171' }}>*</span>
                </label>
                <div className="reg-inp-wrap" style={{ position: 'relative' }}>
                  <i className="fas fa-shield-alt reg-icon" />
                  <input
                    {...register('confirmPassword')}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    className="reg-inp"
                    style={{ paddingRight: '46px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
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
                      fontFamily: 'inherit',
                    }}
                    tabIndex={-1}
                  >
                    <i
                      className={showConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'}
                      style={{ fontSize: '14px' }}
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="reg-err">
                    <i className="fas fa-exclamation-circle" />
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting} className="reg-btn">
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
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus" />
                    Tạo tài khoản
                  </>
                )}
              </button>

              {/* Login link */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '20px',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/auth/login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#67e8f9',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  Đăng nhập →
                </button>
              </div>
            </form>

            {/* Terms */}
            <div
              style={{
                marginTop: '22px',
                padding: '13px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.3)',
                textAlign: 'center',
                lineHeight: 1.7,
              }}
            >
              <i className="fas fa-lock" style={{ marginRight: '5px', color: '#34d399' }} />
              Thông tin của bạn được bảo mật tuyệt đối. Bằng cách đăng ký, bạn đồng ý với{' '}
              <a href="#" style={{ color: '#67e8f9', textDecoration: 'none' }}>
                Điều khoản dịch vụ
              </a>{' '}
              của chúng tôi.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
