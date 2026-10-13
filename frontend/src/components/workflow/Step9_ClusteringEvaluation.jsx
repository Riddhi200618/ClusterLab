import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { SilhouettePlot } from '../visualization/SilhouettePlot';
import { MathBlock } from '../common/MathBlock';
import { CheckSquare, ArrowRight, ArrowLeft, BarChart3, HelpCircle, Sparkles } from 'lucide-react';

export const Step9_ClusteringEvaluation = () => {
  const {
    silhouetteDetails,
    simulationResult,
    selectedAlgorithm,
    nextStep,
    prevStep,
  } = useExperiment();

  const metrics = simulationResult?.metrics || {};

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Step 9: Clustering Quality Evaluation</h1>
            <p className="text-xs text-gray-300">
              Quantify cluster cohesion vs separation using the Silhouette Coefficient, Davies-Bouldin, and Calinski-Harabasz indices.
            </p>
          </div>
        </div>
      </div>

      {/* Tri-Metric Summary Scoreboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Silhouette Metric */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-cyan-950/20 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">1. Silhouette Score</div>
            <div className="text-3xl font-black text-white font-mono mt-1">
              {metrics.silhouette_score !== null && metrics.silhouette_score !== undefined
                ? metrics.silhouette_score.toFixed(3)
                : 'N/A'}
            </div>
            <p className="text-[11px] text-gray-300 mt-2">
              Range [-1, +1]. Measures how similar a point is to its own cluster compared to other clusters.
            </p>
          </div>
          <div className="text-[10px] text-cyan-300 mt-3 font-semibold uppercase">Higher is Better (+1.0 max)</div>
        </div>

        {/* Davies-Bouldin Metric */}
        <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 bg-purple-950/20 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">2. Davies-Bouldin Index</div>
            <div className="text-3xl font-black text-white font-mono mt-1">
              {metrics.davies_bouldin_index !== null && metrics.davies_bouldin_index !== undefined
                ? metrics.davies_bouldin_index.toFixed(3)
                : 'N/A'}
            </div>
            <p className="text-[11px] text-gray-300 mt-2">
              Similarity ratio between each cluster and its most similar counterpart.
            </p>
          </div>
          <div className="text-[10px] text-purple-300 mt-3 font-semibold uppercase">Lower is Better (0.0 ideal)</div>
        </div>

        {/* Calinski-Harabasz Metric */}
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">3. Calinski-Harabasz Index</div>
            <div className="text-3xl font-black text-white font-mono mt-1">
              {metrics.calinski_harabasz_index !== null && metrics.calinski_harabasz_index !== undefined
                ? metrics.calinski_harabasz_index.toFixed(1)
                : 'N/A'}
            </div>
            <p className="text-[11px] text-gray-300 mt-2">
              Variance ratio criterion (between-cluster dispersion / within-cluster dispersion).
            </p>
          </div>
          <div className="text-[10px] text-emerald-300 mt-3 font-semibold uppercase">Higher is Better</div>
        </div>
      </div>

      {/* Silhouette Plot Component */}
      <SilhouettePlot silhouetteData={silhouetteDetails} height={380} />

      {/* Mathematical Formulation */}
      <MathBlock
        title="Silhouette Coefficient Formula"
        formula="s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))} \quad \text{where } a(i) = \frac{1}{|C_i|-1}\sum_{j \in C_i, j \neq i} d(i,j), \quad b(i) = \min_{J \neq I} \frac{1}{|C_J|}\sum_{j \in C_J} d(i,j)"
        description="a(i) is the mean intra-cluster distance to all points in the same cluster. b(i) is the mean nearest-cluster distance. Values close to +1 indicate the point is well matched to its own cluster."
      />

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Visual Canvas</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <span>Compare All 3 Algorithms</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step9_ClusteringEvaluation;
