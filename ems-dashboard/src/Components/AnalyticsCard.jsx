import React from 'react';

export default function AnalyticsCard({ label, value, status = 'default' }) {
  return (
    <div className={`stat-card ${status}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}