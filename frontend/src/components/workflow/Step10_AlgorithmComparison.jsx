import React, { useEffect } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { ComparisonGrid } from '../visualization/ComparisonGrid';
import { GitCompare, ArrowRight, ArrowLeft, RefreshCw, Zap, Trophy } from 'lucide-react';

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
    if (!comparisonResult && activeExperiment) {
      runComparison();
    }
  }, [activeExperiment]);

  const points = activeExperiment?.preprocessed_points || [];
  const featureNames = activeExperiment?.selected_features || ['Feature 1', 'Feature 2'];

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Step 10: Multi-Algorithm Comparison Matrix</h1>
            <p className="text-xs text-gray-300">Evaluate K-Means vs EM vs DBSCAN side-by-side on the identical dataset manifold.</p>
          </div>
        </div>

        <button
          onClick={runComparison}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Comparing...' : 'Re-Run Comparison'}</span>
        </button>
      </div>

      {/* Comparison Grid and Scorecard */}
      {comparisonResult ? (
        <ComparisonGrid
          comparisonResult={comparisonResult}
          points={points}
          featureNames={featureNames}
        />
      ) : (
        <div className="glass-panel p-12 text-center text-gray-400 rounded-2xl space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto text-indigo-400 animate-spin" />
          <p className="text-sm font-semibold text-gray-200">Executing K-Means, EM, and DBSCAN on dataset...</p>
          <p className="text-xs text-gray-500">Computing clustering partitions and Silhouette scores.</p>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Evaluation</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <span>View Saved Runs & Lab Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step10_AlgorithmComparison;
