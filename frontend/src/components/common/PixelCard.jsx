import React from 'react';

const VARIANT_MAP = {
  default: 'bg-[#0E091C] border-[#231542] shadow-[1px_1px_0px_#040208]',
  cyan: 'bg-[#0B1124] border-[#00F0FF]/40 shadow-[1px_1px_0px_#00363B]',
  pink: 'bg-[#15091C] border-[#FF2E93]/40 shadow-[1px_1px_0px_#4D0026]',
  lime: 'bg-[#08150D] border-[#39FF14]/40 shadow-[1px_1px_0px_#0E3B08]',
  yellow: 'bg-[#151206] border-[#FFE600]/40 shadow-[1px_1px_0px_#3B3400]',
  purple: 'bg-[#100720] border-[#9D00FF]/40 shadow-[1px_1px_0px_#2E004D]',
};

export const PixelCard = ({
  children,
  variant = 'default',
  className = '',
  title = null,
  subtitle = null,
  icon = null,
  badge = null,
  headerAction = null,
  cornerRivets = false,
}) => {
  const variantClass = VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <div className={`relative border rounded-none ${variantClass} ${className} transition-all`}>
      {/* Corner Rivet Pixels (Disabled by default for clean laboratory interface) */}
      {cornerRivets && (
        <>
          <div className="absolute top-1 left-1 w-1 h-1 bg-white/20 pointer-events-none" />
          <div className="absolute top-1 right-1 w-1 h-1 bg-white/20 pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/20 pointer-events-none" />
        </>
      )}

      {/* Optional Card Header */}
      {(title || icon || badge || headerAction) && (
        <div className="px-4 py-2.5 border-b border-inherit flex items-center justify-between gap-3 bg-black/20">
          <div className="flex items-center space-x-2.5 min-w-0">
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <div className="min-w-0">
              {title && (
                <h3 className="font-['Silkscreen'] text-xs uppercase tracking-wider font-bold text-white truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] text-gray-400 truncate">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {badge && <div>{badge}</div>}
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
};

export default PixelCard;
