import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { loginSuccess } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    if (!form.username.trim()) {
      toast.error('Tên đăng nhập không được để trống');
      return;
    }
    // Cập nhật local state (chưa có API đổi thông tin user)
    dispatch(
      loginSuccess({
        user: { ...user!, username: form.username, email: form.email },
        token: localStorage.getItem('token') || '',
      })
    );
    toast.success('Cập nhật thông tin thành công');
    setEditing(false);
  };

  return (
    <div
      style={{ minHeight: '80vh', background: '#f8fafc', padding: '2rem 1rem' }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '24px',
          }}
        >
          <i
            className="fas fa-user-circle me-2"
            style={{ color: '#0ea5e9' }}
          ></i>
          Thông tin tài khoản
        </h2>

        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Avatar header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '32px',
                fontWeight: 700,
                color: 'white',
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '18px' }}>
              {user?.username}
            </div>
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                marginTop: '8px',
              }}
            >
              {user?.role === 'Admin' ? 'Quản trị viên' : 'Khách hàng'}
            </div>
          </div>

          {/* Form */}
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#64748b',
                  marginBottom: '6px',
                }}
              >
                TÊN ĐĂNG NHẬP
              </label>
              {editing ? (
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #0ea5e9',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '15px',
                    color: '#1e293b',
                    padding: '10px 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  {user?.username}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#64748b',
                  marginBottom: '6px',
                }}
              >
                EMAIL
              </label>
              {editing ? (
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #0ea5e9',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '15px',
                    color: '#1e293b',
                    padding: '10px 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  {user?.email || (
                    <span style={{ color: '#94a3b8' }}>Chưa cập nhật</span>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#64748b',
                  marginBottom: '6px',
                }}
              >
                VAI TRÒ
              </label>
              <div
                style={{
                  fontSize: '15px',
                  color: '#1e293b',
                  padding: '10px 0',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                {user?.role === 'Admin' ? 'Quản trị viên' : 'Khách hàng'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background:
                        'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    <i className="fas fa-save me-2"></i>Lưu thay đổi
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        username: user?.username || '',
                        email: user?.email || '',
                      });
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#f1f5f9',
                      color: '#64748b',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background:
                      'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  <i className="fas fa-edit me-2"></i>Chỉnh sửa thông tin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
