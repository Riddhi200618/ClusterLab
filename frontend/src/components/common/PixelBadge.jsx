import React from 'react';

const BADGE_VARIANTS = {
  cyan: 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/40',
  pink: 'bg-[#FF2E93]/10 text-[#FF2E93] border-[#FF2E93]/40',
  lime: 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/40',
  yellow: 'bg-[#FFE600]/10 text-[#FFE600] border-[#FFE600]/40',
  purple: 'bg-[#9D00FF]/10 text-[#D8B4FE] border-[#9D00FF]/40',
  dark: 'bg-[#140E29] text-gray-300 border-[#311E57]',
};

export const PixelBadge = ({
  children,
  variant = 'cyan',
  icon = null,
  className = '',
}) => {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.cyan;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2 py-0.5 border text-[10px] font-['Silkscreen'] uppercase tracking-wide font-medium ${variantClass} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default PixelBadge;
