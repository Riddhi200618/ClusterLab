import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { PixelTarget, PixelFlask, PixelJoystick } from '../common/PixelIcons';
import { ArrowRight, ArrowLeft, CheckCircle2, Cpu } from 'lucide-react';

const ALGORITHM_OPTIONS = [
  {
    id: 'kmeans',
    name: 'K-Means Clustering',
    paradigm: 'Centroid Partitioning',
    badge: 'Fast & Scalable',
    variant: 'cyan',
    borderClass: 'border-[#00F0FF]',
    bgClass: 'bg-[#0E152E]',
    icon: PixelTarget,
    summary: 'Groups points around K centres.',
    strengths: ['Simple and fast'],
    limitations: ['Requires the number of clusters K'],
  },
  {
    id: 'em',
    name: 'Expectation Maximization (GMM)',
    paradigm: 'Probabilistic Mixture',
    badge: 'Soft Probabilities',
    variant: 'lime',
    borderClass: 'border-[#39FF14]',
    bgClass: 'bg-[#0B1E12]',
    icon: PixelFlask,
    summary: 'Uses Gaussian distributions to estimate cluster membership probabilities.',
    strengths: ['Allows overlapping clusters'],
    limitations: ['Requires the number of components K'],
  },
  {
    id: 'dbscan',
    name: 'DBSCAN',
    paradigm: 'Spatial Density-Based',
    badge: 'Arbitrary Shapes & Noise',
    variant: 'pink',
    borderClass: 'border-[#FF2E93]',
    bgClass: 'bg-[#1E0B22]',
    icon: PixelJoystick,
    summary: 'Groups dense regions and identifies noise.',
    strengths: ['Finds irregular shapes and noise'],
    limitations: ['Sensitive to eps and minimum points'],
  },
];

export const Step5_AlgorithmSelection = () => {
  const { selectedAlgorithm, setSelectedAlgorithm, nextStep, prevStep } = useExperiment();

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border border-[#231542] bg-[#0E091C] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-[#00F0FF]/40 bg-[#0B1226] flex items-center justify-center text-cyan-300 shadow-sm">
              <Cpu className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-sans text-[10px] text-[#00F0FF]">STAGE 3</span>
                <h1 className="font-sans text-base sm:text-lg font-bold text-white normal-case tracking-normal">
                  Algorithm Selection
                </h1>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 font-sans">
                Choose one clustering algorithm.
              </p>
            </div>
          </div>

          <PixelBadge variant="cyan">
            MODEL SELECT
          </PixelBadge>
        </div>
      </div>

      {/* 3 Algorithm Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {ALGORITHM_OPTIONS.map((alg) => {
          const Icon = alg.icon;
          const isSelected = selectedAlgorithm === alg.id;

          return (
            <div
              key={alg.id}
              onClick={() => setSelectedAlgorithm(alg.id)}
              className={`p-4 sm:p-5 border cursor-pointer transition-all flex flex-col justify-between relative shadow-sm ${
                isSelected
                  ? `${alg.borderClass} ${alg.bgClass}`
                  : 'border-[#20133A] bg-[#0E091C] hover:border-[#3A2269] hover:bg-[#120D24]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-1.5 border border-white/10 bg-black/30">
                    <Icon className="w-5 h-5" />
                  </div>
                  <PixelBadge variant={alg.variant}>
                    {alg.badge}
                  </PixelBadge>
                </div>

                <div className="font-sans text-[10px] text-gray-400 normal-case font-semibold">
                  {alg.paradigm}
                </div>
                <h3 className="font-sans text-xs text-white tracking-normal mt-1">
                  {alg.name}
                </h3>
                <p className="text-xs text-gray-300 mt-2.5 leading-relaxed font-sans">
                  {alg.summary}
                </p>

                {/* Key Strengths */}
                <div className="mt-3.5 pt-2.5 border-t border-white/10">
                  <div className="text-[11px] font-sans font-semibold text-emerald-400 mb-1 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Key Strengths:</span>
                  </div>
                  <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside font-sans">
                    {alg.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between">
                <span className="font-sans text-[10px] text-gray-400">
                  {isSelected ? 'ACTIVE SELECTION' : 'CLICK TO SELECT'}
                </span>
                <span className={`font-sans text-xs font-bold ${
                  isSelected ? 'text-[#00F0FF]' : 'text-gray-500'
                }`}>
                  {isSelected ? '✓ SELECTED' : 'SELECT'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E1136]">
        <PixelButton
          variant="dark"
          size="md"
          onClick={prevStep}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          PREV [FEATURES]
        </PixelButton>

        <PixelButton
          variant="cyan"
          size="md"
          onClick={nextStep}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          NEXT: PARAMETER CONFIG
        </PixelButton>
      </div>
    </div>
  );
};

export default Step5_AlgorithmSelection;
