import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PlotlyWrapper } from '../visualization/PlotlyWrapper';
import { Eye, ArrowRight, ArrowLeft, Box, Sparkles, PieChart, Layers } from 'lucide-react';

export const Step8_InteractiveViz = () => {
  const {
    activeExperiment,
    simulationResult,
    selectedAlgorithm,
    nextStep,
    prevStep,
  } = useExperiment();

  const [show3D, setShow3D] = useState(false);

  const points = activeExperiment?.preprocessed_points || [];
  const featureNames = activeExperiment?.selected_features || ['Feature 1', 'Feature 2'];
  const finalClusters = simulationResult?.final_clusters || [];
  const metrics = simulationResult?.metrics || {};

  const can3D = points.length > 0 && points[0].length >= 3;

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Step 8: Interactive Visualization & Manifold Analysis</h1>
            <p className="text-xs text-gray-300">Inspect resolved cluster partitions, boundary contours, and geometric separations.</p>
          </div>
        </div>

        {can3D && (
          <button
            onClick={() => setShow3D(!show3D)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              show3D
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/20'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>{show3D ? 'Switch to 2D Mode' : 'Switch to 3D Mode'}</span>
          </button>
        )}
      </div>

      {/* Cluster Distribution Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl glass-panel border border-gray-800">
          <span className="text-[11px] text-gray-400 font-medium">Clusters Discovered</span>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">
            {metrics.num_clusters || 0}
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-gray-800">
          <span className="text-[11px] text-gray-400 font-medium">Execution Runtime</span>
          <div className="text-xl font-bold text-indigo-400 font-mono mt-0.5">
            {simulationResult?.execution_time_ms ? `${simulationResult.execution_time_ms} ms` : 'N/A'}
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-gray-800">
          <span className="text-[11px] text-gray-400 font-medium">Noise / Outlier Points</span>
          <div className="text-xl font-bold text-rose-400 font-mono mt-0.5">
            {metrics.num_noise_points || 0}
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-gray-800">
          <span className="text-[11px] text-gray-400 font-medium">Convergence Status</span>
          <div className="text-sm font-bold text-emerald-400 mt-1">
            {simulationResult?.converged ? 'Converged Successfully' : 'Completed'}
          </div>
        </div>
      </div>

      {/* Full Canvas Viewport */}
      <div className="h-[520px] w-full">
        <PlotlyWrapper
          points={points}
          labels={finalClusters}
          featureNames={featureNames}
          title={`Final Resolved Clustering: ${selectedAlgorithm.toUpperCase()}`}
          height={510}
          show3D={show3D}
        />
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Simulation</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <span>Evaluate Clustering Quality (Silhouette Score)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step8_InteractiveViz;
