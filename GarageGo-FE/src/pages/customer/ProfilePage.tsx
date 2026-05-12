import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
    dispatch(
      loginSuccess({
        user: { ...user!, username: form.username, email: form.email },
        token: localStorage.getItem('token') || '',
      })
    );
    toast.success('Cập nhật thành công!');
    setEditing(false);
  };

  const MENU_ITEMS = [
    {
      to: '/customer/orders',
      icon: 'fa-shopping-bag',
      label: 'Lịch sử đơn hàng',
      color: '#8b5cf6',
      desc: 'Xem và theo dõi đơn hàng',
    },
    {
      to: '/customer/service-requests',
      icon: 'fa-clipboard-list',
      label: 'Lịch sử dịch vụ',
      color: '#f59e0b',
      desc: 'Xem lịch sử đặt dịch vụ',
    },
    {
      to: '/customer/cart',
      icon: 'fa-shopping-cart',
      label: 'Giỏ hàng',
      color: '#0ea5e9',
      desc: 'Sản phẩm đang chờ thanh toán',
    },
    {
      to: '/customer/services',
      icon: 'fa-tools',
      label: 'Đặt dịch vụ',
      color: '#22c55e',
      desc: 'Đặt lịch bảo dưỡng xe',
    },
  ];

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    background: editing ? 'white' : '#f8fafc',
    color: editing ? '#1e293b' : '#64748b',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .prof-hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 3.5rem 0 6rem; position: relative; overflow: hidden; }
        .prof-hero::before { content: ''; position: absolute; top: -50%; right: -20%; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%); }
        .prof-hero-inner { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; position: relative; }
        .prof-avatar-wrap { display: flex; align-items: center; gap: 20px; }
        .prof-avatar { width: 80px; height: 80px; border-radius: 20px; background: linear-gradient(135deg, #0ea5e9, #06b6d4); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 900; color: white; box-shadow: 0 8px 24px rgba(14,165,233,0.4); border: 3px solid rgba(255,255,255,0.2); }
        .prof-hero-name { font-size: 1.8rem; font-weight: 900; color: white; margin-bottom: 4px; }
        .prof-hero-role { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; background: rgba(14,165,233,0.2); border: 1px solid rgba(14,165,233,0.3); color: #7dd3fc; font-size: 12px; font-weight: 600; }

        .prof-body { max-width: 900px; margin: -3rem auto 3rem; padding: 0 1.5rem; position: relative; z-index: 1; }
        .prof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        .prof-card { background: white; border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 1px solid #f1f5f9; overflow: hidden; }
        .prof-card-head { padding: 18px 22px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .prof-card-title { font-size: 15px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; }
        .prof-card-body { padding: 22px; }

        .prof-field { margin-bottom: 18px; }
        .prof-label { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }

        .prof-edit-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .prof-edit-btn:hover { border-color: #0ea5e9; color: #0ea5e9; }
        .prof-save-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; border: none; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; font-size: 12px; font-weight: 700; cursor: pointer; }
        .prof-cancel-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; }

        .prof-menu-item { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px; text-decoration: none; transition: all 0.2s; margin-bottom: 8px; border: 1.5px solid #f1f5f9; }
        .prof-menu-item:hover { border-color: #bae6fd; background: #f0f9ff; transform: translateX(4px); }
        .prof-menu-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .prof-menu-text { flex: 1; }
        .prof-menu-label { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
        .prof-menu-desc { font-size: 12px; color: #94a3b8; }

        .prof-stat { text-align: center; padding: 16px; border-radius: 12px; background: #f8fafc; }
        .prof-stat-val { font-size: 1.6rem; font-weight: 900; color: #0ea5e9; }
        .prof-stat-label { font-size: 12px; color: #64748b; margin-top: 2px; }

        @media (max-width: 700px) { .prof-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Hero */}
      <div className="prof-hero">
        <div className="prof-hero-inner">
          <div className="prof-avatar-wrap">
            <div className="prof-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="prof-hero-name">{user?.username}</div>
              <div className="prof-hero-role">
                <i className="fas fa-user-check" style={{ fontSize: '10px' }} />
                {user?.role === 'Admin' ? 'Quản trị viên' : 'Khách hàng'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="prof-body">
        <div className="prof-grid">
          {/* Thông tin tài khoản */}
          <div className="prof-card">
            <div className="prof-card-head">
              <div className="prof-card-title">
                <i
                  className="fas fa-user-circle"
                  style={{ color: '#0ea5e9' }}
                />
                Thông tin tài khoản
              </div>
              {!editing ? (
                <button
                  className="prof-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  <i className="fas fa-edit" />
                  Chỉnh sửa
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="prof-cancel-btn"
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        username: user?.username || '',
                        email: user?.email || '',
                      });
                    }}
                  >
                    Hủy
                  </button>
                  <button className="prof-save-btn" onClick={handleSave}>
                    <i className="fas fa-check" />
                    Lưu
                  </button>
                </div>
              )}
            </div>
            <div className="prof-card-body">
              <div className="prof-field">
                <div className="prof-label">Tên đăng nhập</div>
                <input
                  style={inp}
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  disabled={!editing}
                  onFocus={e =>
                    editing && (e.target.style.borderColor = '#0ea5e9')
                  }
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
              <div className="prof-field">
                <div className="prof-label">Email</div>
                <input
                  style={inp}
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  disabled={!editing}
                  placeholder="Chưa cập nhật"
                  onFocus={e =>
                    editing && (e.target.style.borderColor = '#0ea5e9')
                  }
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
              <div className="prof-field" style={{ marginBottom: 0 }}>
                <div className="prof-label">Vai trò</div>
                <div
                  style={{
                    padding: '11px 14px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#64748b',
                    border: '1.5px solid #f1f5f9',
                  }}
                >
                  <i
                    className="fas fa-shield-alt"
                    style={{ color: '#0ea5e9', marginRight: '8px' }}
                  />
                  {user?.role === 'Admin' ? 'Quản trị viên' : 'Khách hàng'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="prof-card">
            <div className="prof-card-head">
              <div className="prof-card-title">
                <i className="fas fa-th-large" style={{ color: '#8b5cf6' }} />
                Truy cập nhanh
              </div>
            </div>
            <div className="prof-card-body">
              {MENU_ITEMS.map(item => (
                <Link key={item.to} to={item.to} className="prof-menu-item">
                  <div
                    className="prof-menu-icon"
                    style={{ background: `${item.color}15`, color: item.color }}
                  >
                    <i className={`fas ${item.icon}`} />
                  </div>
                  <div className="prof-menu-text">
                    <div className="prof-menu-label">{item.label}</div>
                    <div className="prof-menu-desc">{item.desc}</div>
                  </div>
                  <i
                    className="fas fa-chevron-right"
                    style={{ fontSize: '12px', color: '#cbd5e1' }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Security note */}
        <div
          style={{
            marginTop: '20px',
            padding: '16px 20px',
            background: '#fffbeb',
            borderRadius: '14px',
            border: '1px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <i
            className="fas fa-info-circle"
            style={{ color: '#f59e0b', fontSize: '18px', flexShrink: 0 }}
          />
          <div style={{ fontSize: '13px', color: '#92400e' }}>
            <strong>Lưu ý bảo mật:</strong> Để thay đổi mật khẩu, vui lòng liên
            hệ quản trị viên hoặc sử dụng chức năng quên mật khẩu.
          </div>
        </div>
      </div>
    </div>
  );
};
