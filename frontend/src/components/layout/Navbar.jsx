import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PixelFlask } from '../common/PixelIcons';
import { RotateCcw, Clock, Home, Database, Cpu } from 'lucide-react';

export const Navbar = ({ onToggleWelcome, showWelcome }) => {
  const { goToStep, selectedDatasetSlug, selectedAlgorithm } = useExperiment();

  return (
    <header className="sticky top-0 z-50 bg-[#0A0616] border-b border-[#1E1136] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo & Arcade Title */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => {
            if (onToggleWelcome) onToggleWelcome(true);
            else goToStep(1);
          }}
          title="Return to Welcome Title Screen"
        >
          <div className="w-8 h-8 border border-[#00F0FF]/60 bg-[#0B1226] flex items-center justify-center shadow-sm group-hover:border-[#00F0FF] transition-colors">
            <PixelFlask className="w-5 h-5 text-[#00F0FF]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-['Press_Start_2P'] text-xs sm:text-sm text-white tracking-wide">
                CLUSTER<span className="text-[#00F0FF]">LAB</span>
              </span>
            </div>
            <p className="font-['Silkscreen'] text-[9px] text-gray-400 hidden sm:block">
              VIRTUAL MACHINE LEARNING LABORATORY
            </p>
          </div>
        </div>

        {/* Quick Context Educational Status Chips */}
        <div className="hidden lg:flex items-center space-x-3 text-xs">
          <div className="px-2.5 py-1 border border-[#231542] bg-[#0E091C] flex items-center space-x-2 shadow-sm">
            <Database className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="font-['Silkscreen'] text-[10px] text-gray-400">DATASET:</span>
            <span className="font-mono text-[11px] font-semibold text-white uppercase">
              {selectedDatasetSlug ? selectedDatasetSlug.replace('synthetic_', '') : 'IRIS'}
            </span>
          </div>

          <div className="px-2.5 py-1 border border-[#231542] bg-[#0E091C] flex items-center space-x-2 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#FF2E93]" />
            <span className="font-['Silkscreen'] text-[10px] text-gray-400">ALGORITHM:</span>
            <span className="font-mono text-[11px] font-semibold text-[#FF2E93] uppercase">
              {selectedAlgorithm}
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => onToggleWelcome && onToggleWelcome(!showWelcome)}
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-['Silkscreen'] font-bold text-gray-300 hover:text-white bg-[#120B24] hover:bg-[#1C1236] border border-[#2B184C] shadow-sm transition-all"
            title="Toggle Overview Screen"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{showWelcome ? 'LAB VIEW' : 'OVERVIEW'}</span>
          </button>

          <button
            onClick={() => {
              if (onToggleWelcome) onToggleWelcome(false);
              goToStep(1);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-['Silkscreen'] font-bold text-gray-300 hover:text-white bg-[#120B24] hover:bg-[#1C1236] border border-[#2B184C] shadow-sm transition-all"
            title="Reset to Stage 1 (Learn)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">STAGE 1</span>
          </button>

          <button
            onClick={() => {
              if (onToggleWelcome) onToggleWelcome(false);
              goToStep(11);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-['Silkscreen'] font-bold text-[#00F0FF] hover:text-white bg-[#0B1528] hover:bg-[#101F3B] border border-[#00F0FF]/50 shadow-sm transition-all"
            title="Open Experiment Report (Stage 5)"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>REPORT</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
