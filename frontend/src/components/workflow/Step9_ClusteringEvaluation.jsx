import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { SilhouettePlot } from '../visualization/SilhouettePlot';
import { MathBlock } from '../common/MathBlock';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { CheckSquare, ArrowRight, ArrowLeft } from 'lucide-react';

export const Step9_ClusteringEvaluation = () => {
  const {
    silhouetteDetails,
    simulationResult,
    selectedAlgorithm,
    executeAlgorithm,
    isRunningAlgorithm,
    nextStep,
    prevStep,
  } = useExperiment();

  const metrics = simulationResult?.metrics || {};

  if (!simulationResult) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="p-8 border border-[#231542] bg-[#0E091C] shadow-sm text-center space-y-4 font-mono">
          <p className="text-[#00F0FF] text-sm font-semibold">
            EVALUATION METRICS PENDING SIMULATION...
          </p>
          <p className="text-xs font-sans text-gray-300 max-w-md mx-auto">
            Cluster validity metrics (Silhouette Coefficient, Davies-Bouldin, and Calinski-Harabasz) for {selectedAlgorithm.toUpperCase()} are computed from the simulation output labels. Run the simulation to view the evaluation scoreboard.
          </p>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <PixelButton
              variant="dark"
              size="md"
              onClick={prevStep}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              PREV [LVL 08]
            </PixelButton>
            <PixelButton
              variant="cyan"
              size="md"
              onClick={executeAlgorithm}
              disabled={isRunningAlgorithm}
            >
              {isRunningAlgorithm ? 'EXECUTING...' : 'RUN SIMULATION NOW [START]'}
            </PixelButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border border-[#231542] bg-[#0E091C] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-[#00F0FF]/40 bg-[#0B1226] flex items-center justify-center text-cyan-300 shadow-sm">
              <CheckSquare className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-['Press_Start_2P'] text-[10px] text-[#00F0FF]">STAGE 4</span>
                <h1 className="font-['Silkscreen'] text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Clustering Evaluation
                </h1>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 font-sans">
                Quantify cluster cohesion and separation using the Silhouette Coefficient, Davies-Bouldin Index, and Calinski-Harabasz Index.
              </p>
            </div>
          </div>

          <PixelBadge variant="cyan">
            METRICS
          </PixelBadge>
        </div>
      </div>

      {/* Tri-Metric Summary Scoreboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Silhouette Metric */}
        <div className="p-4 sm:p-5 border border-[#00F0FF]/40 bg-[#0C152B] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-['Silkscreen'] text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider">
                1. SILHOUETTE SCORE
              </span>
              <PixelBadge variant="cyan">MAX +1.0</PixelBadge>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-white mt-2">
              {metrics.silhouette_score !== null && metrics.silhouette_score !== undefined
                ? metrics.silhouette_score.toFixed(3)
                : 'N/A'}
            </div>
            <p className="text-xs text-gray-300 mt-2 font-sans leading-relaxed">
              Range [-1, +1]. Measures how cohesive each point is to its own cluster vs nearest neighbors.
            </p>
          </div>
          <div className="text-[10px] font-mono text-[#00F0FF] mt-3 font-semibold uppercase">
            ▲ HIGHER IS BETTER
          </div>
        </div>

        {/* Davies-Bouldin Metric */}
        <div className="p-4 sm:p-5 border border-[#9D00FF]/40 bg-[#120824] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-['Silkscreen'] text-[10px] font-bold text-[#D8B4FE] uppercase tracking-wider">
                2. DAVIES-BOULDIN
              </span>
              <PixelBadge variant="purple">IDEAL 0.0</PixelBadge>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-white mt-2">
              {metrics.davies_bouldin_index !== null && metrics.davies_bouldin_index !== undefined
                ? metrics.davies_bouldin_index.toFixed(3)
                : 'N/A'}
            </div>
            <p className="text-xs text-gray-300 mt-2 font-sans leading-relaxed">
              Similarity ratio comparing intra-cluster spread against inter-cluster separation.
            </p>
          </div>
          <div className="text-[10px] font-mono text-[#D8B4FE] mt-3 font-semibold uppercase">
            ▼ LOWER IS BETTER
          </div>
        </div>

        {/* Calinski-Harabasz Metric */}
        <div className="p-4 sm:p-5 border border-[#39FF14]/40 bg-[#08150D] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-['Silkscreen'] text-[10px] font-bold text-[#39FF14] uppercase tracking-wider">
                3. CALINSKI-HARABASZ
              </span>
              <PixelBadge variant="lime">RATIO</PixelBadge>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-white mt-2">
              {metrics.calinski_harabasz_index !== null && metrics.calinski_harabasz_index !== undefined
                ? metrics.calinski_harabasz_index.toFixed(1)
                : 'N/A'}
            </div>
            <p className="text-xs text-gray-300 mt-2 font-sans leading-relaxed">
              Variance ratio criterion (between-cluster dispersion divided by within-cluster dispersion).
            </p>
          </div>
          <div className="text-[10px] font-mono text-[#39FF14] mt-3 font-semibold uppercase">
            ▲ HIGHER IS BETTER
          </div>
        </div>
      </div>

      {/* Silhouette Plot Component */}
      <SilhouettePlot silhouetteData={silhouetteDetails} height={380} />

      {/* Mathematical Formulation */}
      <MathBlock
        title="Silhouette Coefficient Formula"
        formula="s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))} \quad \text{where } a(i) = \frac{1}{|C_i|-1}\sum_{j \in C_i, j \neq i} d(i,j), \quad b(i) = \min_{J \neq I} \frac{1}{|C_J|}\sum_{j \in C_J} d(i,j)"
        description="$a(i)$ is the mean intra-cluster distance to all points in the same cluster. $b(i)$ is the mean nearest-cluster distance. Values close to +1 indicate the point is well matched to its own cluster."
      />

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E1136]">
        <PixelButton
          variant="dark"
          size="md"
          onClick={prevStep}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          PREV [VISUALIZATION]
        </PixelButton>

        <PixelButton
          variant="cyan"
          size="md"
          onClick={nextStep}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          NEXT: ALGORITHM COMPARISON
        </PixelButton>
      </div>
    </div>
  );
};

export default Step9_ClusteringEvaluation;
