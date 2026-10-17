import React from 'react';

const SIZE_MAP = {
  sm: 'px-2.5 py-1 text-[10px]',
  md: 'px-4 py-2 text-xs',
  lg: 'px-6 py-3 text-sm',
};

const VARIANT_MAP = {
  cyan: 'pixel-btn-cyan',
  pink: 'pixel-btn-pink',
  lime: 'pixel-btn-lime',
  yellow: 'pixel-btn-yellow',
  purple: 'pixel-btn-purple',
  dark: 'pixel-btn-dark',
};

export const PixelButton = ({
  children,
  onClick,
  variant = 'cyan',
  size = 'md',
  icon = null,
  disabled = false,
  className = '',
  type = 'button',
  title = '',
}) => {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const variantClass = VARIANT_MAP[variant] || VARIANT_MAP.cyan;

  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`pixel-btn ${sizeClass} ${variantClass} ${
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
    >
      {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default PixelButton;
