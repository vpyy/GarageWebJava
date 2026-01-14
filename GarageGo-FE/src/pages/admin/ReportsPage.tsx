import React from 'react';

export const ReportsPage: React.FC = () => {
  return (
    <div>
      <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
        Báo cáo thống kê
      </h3>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <i className="fas fa-chart-bar" style={{ fontSize: '64px', color: '#94a3b8', marginBottom: '1rem' }}></i>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Trang báo cáo thống kê đang được phát triển</p>
      </div>
    </div>
  );
};