import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Gauge,
  RotateCcw
} from 'lucide-react';

export const StepperControls = () => {
  const {
    simulationResult,
    currentStepIndex,
    setCurrentStepIndex,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
  } = useExperiment();

  if (!simulationResult || !simulationResult.steps || simulationResult.steps.length === 0) {
    return null;
  }

  const steps = simulationResult.steps;
  const totalSteps = steps.length;
  const currentStepData = steps[currentStepIndex] || steps[0];

  const handlePlayPause = () => {
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleEnd = () => {
    setIsPlaying(false);
    setCurrentStepIndex(totalSteps - 1);
  };

  return (
    <div className="w-full rounded-2xl glass-panel p-4 shadow-xl border border-indigo-500/20">
      {/* Step Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <span className="font-semibold text-gray-200 text-sm">
            {currentStepData.phase_name || `Phase: ${currentStepData.phase}`}
          </span>
        </div>

        {/* Phase Type Badge */}
        <div className="flex items-center space-x-2 text-xs">
          {currentStepData.converged && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
              Converged
            </span>
          )}
          {currentStepData.wcss !== undefined && (
            <span className="text-gray-400">
              WCSS: <strong className="text-cyan-300">{currentStepData.wcss}</strong>
            </span>
          )}
          {currentStepData.log_likelihood !== undefined && (
            <span className="text-gray-400">
              Log-Likelihood: <strong className="text-emerald-300">{currentStepData.log_likelihood}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Scrubber Range Slider */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={totalSteps - 1}
          value={currentStepIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentStepIndex(parseInt(e.target.value, 10));
          }}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-cyan-400 transition-all"
        />
        <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
          <span>Start (Init)</span>
          <span>Iteration {currentStepData.iteration || 0}</span>
          <span>Final (Convergence)</span>
        </div>
      </div>

      {/* Button Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Main Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Jump to Start"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayPause}
            className={`flex items-center space-x-2 px-5 py-2 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-600/30'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Pause' : currentStepIndex >= totalSteps - 1 ? 'Replay' : 'Play Simulation'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleEnd}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Jump to End"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Speed Controls */}
        <div className="flex items-center space-x-1.5 bg-gray-900/80 border border-gray-800 p-1 rounded-xl">
          <span className="text-[11px] text-gray-400 px-2 font-medium flex items-center space-x-1">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Speed:</span>
          </span>
          {[0.5, 1, 2, 4].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                playbackSpeed === speed
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepperControls;
