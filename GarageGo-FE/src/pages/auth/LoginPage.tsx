import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';

interface LoginForm {
  username: string;
  password: string;
}

const schema = yup.object({
  username: yup.string().required('Tên đăng nhập là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc'),
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema) as any,
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    dispatch(loginStart());

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      if (data.username === 'admin' && data.password === 'admin') {
        const user = {
          id: 1,
          username: 'admin',
          email: 'admin@mtproauto.com',
          role: 'Admin' as const,
          name: 'Administrator'
        };
        dispatch(loginSuccess({ user, token: 'mock-admin-token' }));
        toast.success('Đăng nhập thành công!');
        navigate('/admin/dashboard');
      } else if (data.username === 'customer' && data.password === 'customer') {
        const user = {
          id: 2,
          username: 'customer',
          email: 'customer@mtproauto.com',
          role: 'Customer' as const,
          name: 'Khách hàng'
        };
        dispatch(loginSuccess({ user, token: 'mock-customer-token' }));
        toast.success('Đăng nhập thành công!');
        navigate('/customer/home');
      } else {
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      margin: 0
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        minHeight: '600px'
      }}>
        {/* Left Side - Illustration */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #e3eaf5 0%, #d4dff0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          position: 'relative'
        }}>
          <div style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              fontSize: '180px',
              color: '#4e73df',
              marginBottom: '30px',
              animation: 'float 3s ease-in-out infinite'
            }}>
              <i className="fas fa-car-side"></i>
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#2c3e50',
              marginBottom: '10px'
            }}>
              MTProAuto Admin
            </div>
            <div style={{
              fontSize: '15px',
              color: '#7f8c8d',
              lineHeight: 1.6
            }}>
              Hệ thống quản lý gara ô tô<br />chuyên nghiệp và hiện đại
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={{
          flex: 1,
          padding: '60px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#2c3e50',
              marginBottom: '8px'
            }}>
              Đăng nhập
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#7f8c8d'
            }}>
              Vui lòng đăng nhập để tiếp tục
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontWeight: 500,
                color: '#5a6c7d',
                marginBottom: '8px',
                fontSize: '13px',
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Tên đăng nhập
              </label>
              <input
                {...register('username')}
                type="text"
                placeholder="admin"
                style={{
                  width: '100%',
                  height: '50px',
                  border: '1px solid #dfe6e9',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4e73df';
                  e.target.style.boxShadow = '0 0 0 3px rgba(78, 115, 223, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#dfe6e9';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.username && (
                <div style={{
                  color: '#e74c3c',
                  fontSize: '12px',
                  marginTop: '5px'
                }}>
                  {errors.username.message}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontWeight: 500,
                color: '#5a6c7d',
                marginBottom: '8px',
                fontSize: '13px',
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Mật khẩu
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%',
                  height: '50px',
                  border: '1px solid #dfe6e9',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4e73df';
                  e.target.style.boxShadow = '0 0 0 3px rgba(78, 115, 223, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#dfe6e9';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.password && (
                <div style={{
                  color: '#e74c3c',
                  fontSize: '12px',
                  marginTop: '5px'
                }}>
                  {errors.password.message}
                </div>
              )}
            </div>

            <div style={{
              textAlign: 'right',
              marginBottom: '24px'
            }}>
              <a href="#" style={{
                color: '#4e73df',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500
              }}>
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '50px',
                background: isSubmitting ? '#95a5a6' : 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(78, 115, 223, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }}></div>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>

            <div style={{
              textAlign: 'center',
              fontSize: '13px',
              color: '#7f8c8d'
            }}>
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => navigate('/auth/register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4e73df',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                Đăng ký ngay
              </button>
            </div>
          </form>

          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#6c757d'
          }}>
            <strong>Demo accounts:</strong><br />
            Admin: admin / admin<br />
            Customer: customer / customer
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};