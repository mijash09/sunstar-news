import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'icon' | 'primary' | 'tab' | 'poll' | 'font';
  active?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  active = false,
  className = '',
  ...props
}: ButtonProps) {
  let variantClass = 'icon-btn';

  if (variant === 'tab') {
    variantClass = `pradesh-tab-btn ${active ? 'active' : ''}`;
  } else if (variant === 'poll') {
    variantClass = `poll-option-btn ${active ? 'selected' : ''}`;
  } else if (variant === 'font') {
    variantClass = 'font-btn';
  }

  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
