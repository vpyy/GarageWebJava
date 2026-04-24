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

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema) as any,
  });

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

      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

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
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '480px',
          width: '100%',
          background: 'white',
          borderRadius: '24px',
          padding: '3rem',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #cbd5e1',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
              color: 'white',
              fontSize: '2.5rem',
              boxShadow:
                '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <i className="fas fa-user-plus"></i>
          </div>
          <h2
            style={{
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '0.5rem',
              fontSize: '1.875rem',
            }}
          >
            Đăng ký tài khoản
          </h2>
          <p
            style={{
              color: '#64748b',
              fontSize: '0.95rem',
            }}
          >
            Tạo tài khoản mới để sử dụng dịch vụ
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              position: 'relative',
              marginBottom: '1.25rem',
            }}
          >
            <i
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                zIndex: 10,
                fontSize: '1.1rem',
              }}
              className="fas fa-user"
            ></i>
            <input
              {...register('username')}
              type="text"
              placeholder="Tên đăng nhập"
              style={{
                paddingLeft: '3rem',
                border: '2px solid #cbd5e1',
                borderRadius: '12px',
                paddingTop: '0.875rem',
                paddingBottom: '0.875rem',
                paddingRight: '1rem',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                width: '100%',
                outline: 'none',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#0ea5e9';
                e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.username && (
              <div
                style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                }}
              >
                {errors.username.message}
              </div>
            )}
          </div>

          <div
            style={{
              position: 'relative',
              marginBottom: '1.25rem',
            }}
          >
            <i
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                zIndex: 10,
                fontSize: '1.1rem',
              }}
              className="fas fa-envelope"
            ></i>
            <input
              {...register('email')}
              type="email"
              placeholder="Email (tùy chọn)"
              style={{
                paddingLeft: '3rem',
                border: '2px solid #cbd5e1',
                borderRadius: '12px',
                paddingTop: '0.875rem',
                paddingBottom: '0.875rem',
                paddingRight: '1rem',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                width: '100%',
                outline: 'none',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#0ea5e9';
                e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.email && (
              <div
                style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                }}
              >
                {errors.email.message}
              </div>
            )}
          </div>

          <div
            style={{
              position: 'relative',
              marginBottom: '1.25rem',
            }}
          >
            <i
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                zIndex: 10,
                fontSize: '1.1rem',
              }}
              className="fas fa-lock"
            ></i>
            <input
              {...register('password')}
              type="password"
              placeholder="Mật khẩu"
              style={{
                paddingLeft: '3rem',
                border: '2px solid #cbd5e1',
                borderRadius: '12px',
                paddingTop: '0.875rem',
                paddingBottom: '0.875rem',
                paddingRight: '1rem',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                width: '100%',
                outline: 'none',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#0ea5e9';
                e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.password && (
              <div
                style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                }}
              >
                {errors.password.message}
              </div>
            )}
          </div>

          <div
            style={{
              position: 'relative',
              marginBottom: '1.5rem',
            }}
          >
            <i
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                zIndex: 10,
                fontSize: '1.1rem',
              }}
              className="fas fa-lock"
            ></i>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="Xác nhận mật khẩu"
              style={{
                paddingLeft: '3rem',
                border: '2px solid #cbd5e1',
                borderRadius: '12px',
                paddingTop: '0.875rem',
                paddingBottom: '0.875rem',
                paddingRight: '1rem',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                width: '100%',
                outline: 'none',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#0ea5e9';
                e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.confirmPassword && (
              <div
                style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                }}
              >
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: isSubmitting
                ? '#94a3b8'
                : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.875rem 1rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseOver={e => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow =
                  '0 10px 15px -3px rgba(14, 165, 233, 0.3)';
              }
            }}
            onMouseOut={e => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {isSubmitting ? (
              <>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px',
                  }}
                ></div>
                Đang đăng ký...
              </>
            ) : (
              'Đăng ký'
            )}
          </button>

          <div
            style={{
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#64748b',
            }}
          >
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0ea5e9',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Đăng nhập ngay
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
