import React from 'react';

interface RankBadgeProps {
  index: number;
}

export const RankBadge: React.FC<RankBadgeProps> = ({ index }) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
      index === 0
        ? 'bg-yellow-500'
        : index === 1
          ? 'bg-gray-400'
          : index === 2
            ? 'bg-orange-500'
            : 'bg-blue-500'
    }`}
  >
    {index + 1}
  </div>
);

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  onReload: () => void;
}

export const StatEmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  onReload,
}) => (
  <div className="text-center py-20">
    <div className="text-gray-400 mb-4">
      <i className={`${icon} text-6xl`}></i>
    </div>
    <h3 className="text-xl font-semibold text-gray-600 mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{description}</p>
    <button
      onClick={onReload}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
    >
      <i className="fas fa-sync-alt"></i>
      Tải lại dữ liệu
    </button>
  </div>
);
