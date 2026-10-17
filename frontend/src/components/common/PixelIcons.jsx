import React from 'react';

// Pixel Star icon
export const PixelStar = ({ className = "w-4 h-4 text-yellow-400" }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="2" />
    <rect x="6" y="3" width="4" height="2" />
    <rect x="1" y="5" width="14" height="2" />
    <rect x="2" y="7" width="12" height="2" />
    <rect x="4" y="9" width="8" height="2" />
    <rect x="5" y="11" width="6" height="2" />
    <rect x="3" y="13" width="3" height="2" />
    <rect x="10" y="13" width="3" height="2" />
  </svg>
);

// Pixel Coin icon
export const PixelCoin = ({ className = "w-4 h-4 text-yellow-300" }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="5" y="1" width="6" height="2" />
    <rect x="3" y="3" width="10" height="2" />
    <rect x="2" y="5" width="12" height="6" />
    <rect x="3" y="11" width="10" height="2" />
    <rect x="5" y="13" width="6" height="2" />
    <rect x="6" y="5" width="4" height="6" fill="#1C1808" />
  </svg>
);

// Pixel Cloud icon
export const PixelCloud = ({ className = "w-6 h-4 text-cyan-200/60" }) => (
  <svg viewBox="0 0 20 12" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="6" y="1" width="8" height="2" />
    <rect x="4" y="3" width="12" height="2" />
    <rect x="2" y="5" width="16" height="4" />
    <rect x="1" y="9" width="18" height="2" />
  </svg>
);

// Pixel Flask / Cluster Beaker icon
export const PixelFlask = ({ className = "w-6 h-6 text-cyan-400" }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="6" y="1" width="4" height="2" />
    <rect x="7" y="3" width="2" height="3" />
    <rect x="5" y="6" width="6" height="2" />
    <rect x="3" y="8" width="10" height="2" />
    <rect x="2" y="10" width="12" height="4" />
    <rect x="4" y="14" width="8" height="1" />
    {/* Liquid highlight */}
    <rect x="4" y="11" width="4" height="2" fill="#FF2E93" />
    <rect x="9" y="12" width="2" height="1" fill="#FFE600" />
  </svg>
);

// Pixel Trophy / Winner Crown
export const PixelCrown = ({ className = "w-5 h-5 text-yellow-400" }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="1" y="3" width="2" height="2" />
    <rect x="7" y="2" width="2" height="2" />
    <rect x="13" y="3" width="2" height="2" />
    <rect x="2" y="5" width="12" height="2" />
    <rect x="3" y="7" width="10" height="4" />
    <rect x="2" y="11" width="12" height="2" />
    <rect x="4" y="13" width="8" height="2" />
    {/* Ruby gems */}
    <rect x="4" y="8" width="2" height="2" fill="#FF2E93" />
    <rect x="7" y="7" width="2" height="2" fill="#00F0FF" />
    <rect x="10" y="8" width="2" height="2" fill="#39FF14" />
  </svg>
);

// Pixel Gamepad / Arcade Joystick
export const PixelJoystick = ({ className = "w-5 h-5 text-purple-400" }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="7" y="1" width="2" height="2" fill="#FF2E93" />
    <rect x="7" y="3" width="2" height="4" />
    <rect x="5" y="7" width="6" height="2" />
    <rect x="2" y="9" width="12" height="5" />
    <rect x="4" y="10" width="2" height="2" fill="#00F0FF" />
    <rect x="10" y="10" width="2" height="2" fill="#39FF14" />
  </svg>
);

// Pixel Crosshair / Centroid Target
export const PixelTarget = ({ className = "w-5 h-5 text-pink-500" }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} shapeRendering="crispEdges">
    <rect x="7" y="0" width="2" height="4" />
    <rect x="7" y="12" width="2" height="4" />
    <rect x="0" y="7" width="4" height="2" />
    <rect x="12" y="7" width="4" height="2" />
    <rect x="5" y="3" width="6" height="2" />
    <rect x="5" y="11" width="6" height="2" />
    <rect x="3" y="5" width="2" height="6" />
    <rect x="11" y="5" width="2" height="6" />
    <rect x="7" y="7" width="2" height="2" fill="#FFE600" />
  </svg>
);
