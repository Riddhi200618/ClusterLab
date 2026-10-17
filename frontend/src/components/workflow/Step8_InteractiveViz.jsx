import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PlotlyWrapper } from '../visualization/PlotlyWrapper';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { Eye, ArrowRight, ArrowLeft, Box } from 'lucide-react';

export const Step8_InteractiveViz = () => {
  const {
    activeExperiment,
    simulationResult,
    selectedAlgorithm,
    executeAlgorithm,
    isRunningAlgorithm,
    nextStep,
    prevStep,
  } = useExperiment();

  const [show3D, setShow3D] = useState(false);

  const points = activeExperiment?.preprocessed_points || [];
  const featureNames = activeExperiment?.selected_features || ['Feature 1', 'Feature 2'];
  const finalClusters = simulationResult?.final_clusters || [];
  const metrics = simulationResult?.metrics || {};

  const can3D = points.length > 0 && points[0].length >= 3;

  if (!simulationResult) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="p-6 sm:p-8 border border-[#20133A] bg-[#0E091C] shadow-sm text-center space-y-4 font-['Silkscreen']">
          <p className="text-[#00F0FF] text-sm">
            MANIFOLD VISUALIZATION PENDING SIMULATION...
          </p>
          <p className="text-xs font-sans text-gray-300 max-w-md mx-auto">
            Execute the {selectedAlgorithm.toUpperCase()} algorithm on the loaded dataset to render the 2D/3D interactive manifold canvas.
          </p>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <PixelButton
              variant="dark"
              size="md"
              onClick={prevStep}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              PREV [STEP 07]
            </PixelButton>
            <PixelButton
              variant="cyan"
              size="md"
              onClick={executeAlgorithm}
              disabled={isRunningAlgorithm}
            >
              {isRunningAlgorithm ? 'EXECUTING...' : 'RUN SIMULATION NOW'}
            </PixelButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border border-[#231542] bg-[#0E091C] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 border border-[#00F0FF]/40 bg-[#0B1226] flex items-center justify-center text-cyan-300 shadow-sm">
            <Eye className="w-5 h-5 text-[#00F0FF]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-['Press_Start_2P'] text-[10px] text-[#00F0FF]">STAGE 4</span>
              <h1 className="font-['Silkscreen'] text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                Cluster Visualization
              </h1>
            </div>
            <p className="text-xs text-gray-300 mt-0.5 font-sans">
              Interactive spatial visualization of final cluster assignments, density partitions, and separation boundaries.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {can3D && (
            <PixelButton
              variant="purple"
              size="sm"
              onClick={() => setShow3D(!show3D)}
              icon={<Box className="w-4 h-4" />}
            >
              {show3D ? '2D VIEW' : '3D VIEW'}
            </PixelButton>
          )}

          <PixelBadge variant="purple">
            {selectedAlgorithm.toUpperCase()}
          </PixelBadge>
        </div>
      </div>

      {/* Cluster Distribution Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400">CLUSTERS FOUND:</span>
          <div className="font-mono text-base font-bold text-[#00F0FF] mt-0.5">
            {metrics.num_clusters || 0}
          </div>
        </div>

        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400">RUNTIME (MS):</span>
          <div className="font-mono text-base font-bold text-[#39FF14] mt-0.5">
            {simulationResult?.execution_time_ms ? `${simulationResult.execution_time_ms}` : '0'}
          </div>
        </div>

        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400">NOISE POINTS:</span>
          <div className="font-mono text-base font-bold text-[#FF2E93] mt-0.5">
            {metrics.num_noise_points || 0}
          </div>
        </div>

        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400">STATUS:</span>
          <div className="font-mono text-xs font-bold text-yellow-400 mt-1">
            {simulationResult?.converged ? 'CONVERGED' : 'COMPLETED'}
          </div>
        </div>
      </div>

      {/* Full Canvas Viewport */}
      <div className="h-[520px] w-full border border-[#1E1136] bg-[#080512]">
        <PlotlyWrapper
          points={points}
          labels={finalClusters}
          featureNames={featureNames}
          title={`Final Clustered Manifold: ${selectedAlgorithm.toUpperCase()}`}
          height={510}
          show3D={show3D}
        />
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E1136]">
        <PixelButton
          variant="dark"
          size="md"
          onClick={prevStep}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          PREV [SIMULATION]
        </PixelButton>

        <PixelButton
          variant="cyan"
          size="md"
          onClick={nextStep}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          NEXT: EVALUATION METRICS
        </PixelButton>
      </div>
    </div>
  );
};

export default Step8_InteractiveViz;
