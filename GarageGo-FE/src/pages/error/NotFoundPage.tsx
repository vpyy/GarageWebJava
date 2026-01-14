import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div>
        <h1 style={{ fontSize: '6rem', fontWeight: 700, color: '#0ea5e9', marginBottom: '1rem' }}>
          404
        </h1>
        <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
          Trang không tìm thấy
        </h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1rem 2rem',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '12px',
          fontWeight: 600
        }}>
          <i className="fas fa-home"></i>
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};