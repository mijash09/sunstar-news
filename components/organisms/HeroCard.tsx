'use client';

import React from 'react';
import Badge from '@/components/atoms/Badge';
import { Article } from '@/lib/data';

interface HeroCardProps {
  lead: Article;
  secondaryLeads: Article[];
  onSelectArticle: (id: string) => void;
}

export default function HeroCard({
  lead,
  secondaryLeads,
  onSelectArticle,
}: HeroCardProps) {
  return (
    <section className="hero-lead-section-ekantipur" id="hero" style={{ marginBottom: '32px' }}>
      {/* Upper Block: Left Title & Sub-headlines + Right Lead Image */}
      <div className="hero-upper-grid">
        {/* Left Sub-Column */}
        <div className="hero-left-text-block">
          <div className="hero-main-title-box" onClick={() => onSelectArticle(lead.id)}>
            <h1 className="hero-main-headline">{lead.title}</h1>
            <p className="hero-main-summary">{lead.summary}</p>
            <div className="read-time-badge">3 MINS READ</div>
          </div>

          <div className="hero-sub-headlines">
            {secondaryLeads.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="hero-sub-headline-item"
                onClick={() => onSelectArticle(item.id)}
              >
                <h3 className="sub-item-title">{item.title}</h3>
                <div className="read-time-badge">2 MINS READ</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sub-Column: Main Featured Photo */}
        <div
          className="hero-right-photo-block"
          onClick={() => onSelectArticle(lead.id)}
        >
          <Badge variant="category">{lead.category}</Badge>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lead.image} alt={lead.title} />
        </div>
      </div>

      {/* Horizontal Divider Line */}
      <hr className="hero-divider-line" />

      {/* Lower Block: Live Updates Block (Left LIVE Title & Summary + Right Rescue Photo) */}
      <div className="hero-lower-live-grid">
        <div className="live-left-block">
          <div className="live-badge-red">LIVE</div>
          <h2
            className="live-lead-title"
            onClick={() => onSelectArticle(secondaryLeads[0]?.id || lead.id)}
          >
            भोटेकोशी विपत्तिको एघारौं दिन : खोजी–उद्धारमा के भइरहेको छ ?
          </h2>
          <p className="live-lead-summary">
            भोटेकोशी विपत्तिको एघारौं दिन। आज पनि दुई जनाको जीवितै उद्धार गरिएको छ। शुक्रबार पनि त्रिशूली-३ 'ए'को सुरुङबाट दुई जनालाई जीवितै उद्धार गरिएको थियो।
          </p>
        </div>

        <div
          className="live-right-photo-block"
          onClick={() => onSelectArticle(secondaryLeads[0]?.id || lead.id)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://assets-cdn.ekantipur.com/uploads/source/news/kantipur/2026/natural-disaster/belly-bridge-devighat-trisuli-bhfrenovation-0592026015913-1000x0.jpg"
            alt="Rescue Operations"
          />
        </div>
      </div>
    </section>
  );
}
