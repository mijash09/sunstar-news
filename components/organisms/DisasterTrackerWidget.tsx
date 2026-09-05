'use client';

import React from 'react';

export default function DisasterTrackerWidget() {
  return (
    <div className="disaster-tracker-card" style={{ marginBottom: '28px' }}>
      <h3 className="disaster-card-title">भोटेकोशी बाढी अपडेट</h3>

      <div className="disaster-stat-row">
        <span className="stat-label">Deaths</span>
        <span className="stat-value stat-deaths">1344</span>
      </div>

      <div className="disaster-stat-row">
        <span className="stat-label">Rescued</span>
        <span className="stat-value stat-rescued">13098</span>
      </div>

      <div className="disaster-stat-row">
        <span className="stat-label">Out of Contact</span>
        <span className="stat-value stat-missing">5000</span>
      </div>

      <div className="disaster-meta">
        <div>Source : Official figures • NDRRMA</div>
        <div>Last Updated : 5 Sept, 1:18 pm</div>
      </div>

      <a
        href="https://pmrf.gov.np"
        target="_blank"
        rel="noopener noreferrer"
        className="donate-btn-card"
      >
        <span>Donate to PM Relief Fund</span>
        <span>➔</span>
      </a>
    </div>
  );
}
