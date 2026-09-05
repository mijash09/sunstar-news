import React from 'react';

interface MainNewsLayoutProps {
  mainContent: React.ReactNode;
  sidebarContent: React.ReactNode;
}

export default function MainNewsLayout({
  mainContent,
  sidebarContent,
}: MainNewsLayoutProps) {
  return (
    <div className="two-col-layout">
      <div className="left-main-column">{mainContent}</div>
      <aside className="right-sidebar">{sidebarContent}</aside>
    </div>
  );
}
