import React from 'react';
import { Sigma } from 'lucide-react';

export const MathBlock = ({ formula, title = 'Mathematical Formulation', description }) => {
  if (!formula) return null;

  return (
    <div className="rounded-xl bg-gray-900/90 border border-indigo-500/20 p-4 shadow-inner">
      <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
        <Sigma className="w-4 h-4" />
        <span>{title}</span>
      </div>

      <div className="bg-black/40 rounded-lg p-3 border border-gray-800 font-mono text-cyan-300 text-sm overflow-x-auto tracking-wide text-center">
        {formula}
      </div>

      {description && (
        <p className="text-xs text-gray-400 mt-2 leading-relaxed italic">
          {description}
        </p>
      )}
    </div>
  );
};

export default MathBlock;
