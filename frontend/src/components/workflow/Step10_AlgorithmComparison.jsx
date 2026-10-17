import React, { useEffect } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { ComparisonGrid } from '../visualization/ComparisonGrid';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { GitCompare, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

export const Step10_AlgorithmComparison = () => {
  const {
    activeExperiment,
    comparisonResult,
    runComparison,
    nextStep,
    prevStep,
    loading
  } = useExperiment();

  useEffect(() => {
    if (!comparisonResult) {
      runComparison();
    }
  }, [comparisonResult, runComparison]);

  const points = activeExperiment?.preprocessed_points || [];
  const featureNames = activeExperiment?.selected_features || ['Feature 1', 'Feature 2'];

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border border-amber-500/40 bg-[#140F08] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 border border-amber-400/40 bg-[#241A06] flex items-center justify-center text-yellow-300 shadow-sm">
            <GitCompare className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-['Press_Start_2P'] text-[10px] text-yellow-400">STAGE 4</span>
              <h1 className="font-['Silkscreen'] text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                Algorithm Comparison
              </h1>
            </div>
            <p className="text-xs text-gray-300 mt-0.5 font-sans">
              Side-by-side benchmark comparison of K-Means, EM/GMM, and DBSCAN on identical feature inputs and scaling.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <PixelButton
            variant="yellow"
            size="sm"
            onClick={runComparison}
            disabled={loading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            {loading ? 'COMPARING...' : 'RE-RUN BENCHMARK'}
          </PixelButton>

          <PixelBadge variant="yellow">
            BENCHMARK
          </PixelBadge>
        </div>
      </div>

      {/* Comparison Grid and Scorecard */}
      {comparisonResult ? (
        <ComparisonGrid
          comparisonResult={comparisonResult}
          points={points}
          featureNames={featureNames}
        />
      ) : (
        <div className="border border-[#20133A] bg-[#0E091C] p-8 sm:p-10 text-center text-gray-400 shadow-sm space-y-3">
          <RefreshCw className="w-7 h-7 mx-auto text-[#00F0FF] animate-spin" />
          <p className="font-['Silkscreen'] text-sm font-bold text-gray-200">
            {loading ? 'EXECUTING K-MEANS, EM, AND DBSCAN IN PARALLEL...' : 'COMPARISON PENDING EXECUTION'}
          </p>
          <p className="text-xs text-gray-400 font-sans">
            Standardizing metrics, computing Silhouette coefficients, and identifying optimal model.
          </p>
          {!loading && (
            <div className="pt-2">
              <PixelButton
                variant="yellow"
                size="md"
                onClick={runComparison}
              >
                RUN BENCHMARK NOW
              </PixelButton>
            </div>
          )}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E1136]">
        <PixelButton
          variant="dark"
          size="md"
          onClick={prevStep}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          PREV [EVALUATION]
        </PixelButton>

        <PixelButton
          variant="cyan"
          size="md"
          onClick={nextStep}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          NEXT: EXPERIMENT REPORT [STAGE 5]
        </PixelButton>
      </div>
    </div>
  );
};

export default Step10_AlgorithmComparison;
