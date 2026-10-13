import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { Sparkles, RotateCcw, BookOpen, Database, PlayCircle, BarChart3, Clock, CheckCircle2 } from 'lucide-react';

export const Navbar = () => {
  const { currentStep, goToStep, selectedDatasetSlug, selectedAlgorithm, activeExperiment } = useExperiment();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => goToStep(1)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-white">Cluster<span className="text-cyan-400">Lab</span></span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Virtual ML Lab
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">Interactive Clustering Algorithms Laboratory</p>
          </div>
        </div>

        {/* Quick Context Chips */}
        <div className="hidden md:flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700/60 flex items-center space-x-2">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-gray-400">Dataset:</span>
            <span className="font-semibold text-gray-200 uppercase">{selectedDatasetSlug.replace('synthetic_', '')}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700/60 flex items-center space-x-2">
            <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-gray-400">Algorithm:</span>
            <span className="font-semibold text-gray-200 uppercase">{selectedAlgorithm}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => goToStep(1)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700 rounded-lg transition-all"
            title="Start from Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Lab</span>
          </button>

          <button
            onClick={() => goToStep(11)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/50 rounded-lg transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
