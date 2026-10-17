import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PixelBadge } from '../common/PixelBadge';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Gauge
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
    <div className="w-full border border-[#20133A] bg-[#0E091C] p-3 sm:p-4 shadow-sm">
      {/* Step Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2.5 border-b border-[#1E1136]">
        <div className="flex items-center space-x-2">
          <PixelBadge variant="cyan">
            FRAME {currentStepIndex + 1} / {totalSteps}
          </PixelBadge>
          <span className="font-['Silkscreen'] text-xs font-bold text-white tracking-wide truncate">
            {currentStepData.phase_name || `Phase: ${currentStepData.phase}`}
          </span>
        </div>

        {/* Phase Type Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          {currentStepData.converged && (
            <PixelBadge variant="lime">
              CONVERGED
            </PixelBadge>
          )}
          {currentStepData.wcss !== undefined && (
            <span className="text-gray-400">
              WCSS: <strong className="text-[#00F0FF]">{currentStepData.wcss}</strong>
            </span>
          )}
          {currentStepData.log_likelihood !== undefined && (
            <span className="text-gray-400">
              LL: <strong className="text-[#39FF14]">{currentStepData.log_likelihood}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Scrubber Range Slider */}
      <div className="mb-3">
        <input
          type="range"
          min="0"
          max={totalSteps - 1}
          value={currentStepIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentStepIndex(parseInt(e.target.value, 10));
          }}
          className="w-full h-2 bg-[#090514] appearance-none cursor-pointer accent-[#00F0FF]"
        />
        <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
          <span>FRAME 01 (INIT)</span>
          <span className="text-yellow-400 font-bold">ITERATION {currentStepData.iteration || 0}</span>
          <span>FRAME {totalSteps} (FINAL)</span>
        </div>
      </div>

      {/* Button Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Main Navigation */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={handleReset}
            disabled={currentStepIndex === 0}
            className="p-1.5 sm:p-2 border border-[#20133A] bg-[#120B24] hover:bg-[#1A1033] text-gray-300 disabled:opacity-30 disabled:pointer-events-none shadow-sm transition-all"
            title="Jump to Start"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1.5 sm:p-2 border border-[#20133A] bg-[#120B24] hover:bg-[#1A1033] text-gray-300 disabled:opacity-30 disabled:pointer-events-none shadow-sm transition-all"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayPause}
            className={`flex items-center space-x-1.5 px-4 py-1.5 border font-['Silkscreen'] font-bold text-xs uppercase shadow-sm transition-all ${
              isPlaying
                ? 'border-[#FFE600] bg-[#FFE600] text-[#1A1400]'
                : 'border-[#00F0FF] bg-[#00F0FF] text-[#050510] hover:bg-[#38BDF8]'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'PAUSE' : currentStepIndex >= totalSteps - 1 ? 'REPLAY' : 'PLAY SIM'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-1.5 sm:p-2 border border-[#20133A] bg-[#120B24] hover:bg-[#1A1033] text-gray-300 disabled:opacity-30 disabled:pointer-events-none shadow-sm transition-all"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleEnd}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-1.5 sm:p-2 border border-[#20133A] bg-[#120B24] hover:bg-[#1A1033] text-gray-300 disabled:opacity-30 disabled:pointer-events-none shadow-sm transition-all"
            title="Jump to End"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Speed Controls */}
        <div className="flex items-center space-x-1 border border-[#20133A] bg-[#0A0617] p-0.5">
          <span className="text-[10px] font-['Silkscreen'] text-gray-400 px-1.5 font-bold flex items-center space-x-1">
            <Gauge className="w-3 h-3 text-[#00F0FF]" />
            <span>SPEED:</span>
          </span>
          {[0.5, 1, 2, 4].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-all border ${
                playbackSpeed === speed
                  ? 'border-[#00F0FF] bg-[#00F0FF] text-[#050510]'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-[#140E29]'
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
