import React, { useMemo } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PlotlyWrapper } from '../visualization/PlotlyWrapper';
import { StepperControls } from '../visualization/StepperControls';
import { ConvergencePlot } from '../visualization/ConvergencePlot';
import { MathBlock } from '../common/MathBlock';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { Play, ArrowRight, ArrowLeft, Info, ChevronDown } from 'lucide-react';

export const Step7_StepByStepExecution = () => {
  const {
    activeExperiment,
    simulationResult,
    currentStepIndex,
    selectedAlgorithm,
    executeAlgorithm,
    isRunningAlgorithm,
    nextStep,
    prevStep,
  } = useExperiment();

  const points = activeExperiment?.preprocessed_points || [];
  const featureNames = activeExperiment?.selected_features || ['Feature 1', 'Feature 2'];

  const currentStepData = useMemo(() => {
    if (!simulationResult || !simulationResult.steps || simulationResult.steps.length === 0) return null;
    return simulationResult.steps[currentStepIndex] || simulationResult.steps[0];
  }, [simulationResult, currentStepIndex]);

  if (!simulationResult || !currentStepData) {
    return (
      <div className="border border-[#231542] bg-[#0E091C] shadow-sm p-8 text-center text-gray-400 max-w-4xl mx-auto my-12 font-mono space-y-4">
        <p className="text-[#00F0FF] text-sm font-semibold">SIMULATION DATA PENDING EXECUTION...</p>
        <p className="text-xs font-sans text-gray-400 max-w-md mx-auto">
          Execute the {selectedAlgorithm.toUpperCase()} algorithm on the loaded dataset to generate step snapshots and centroid trajectories.
        </p>
        <div className="flex items-center justify-center space-x-3 pt-2">
          <PixelButton
            variant="dark"
            size="md"
            onClick={prevStep}
          >
            PREV [PARAMETERS]
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
    );
  }

  // Extract step variables for rendering
  const labels = currentStepData.assignments || currentStepData.hard_assignments || currentStepData.cluster_labels || [];
  const centroids = currentStepData.centroids || currentStepData.means || [];
  const previousCentroids = currentStepData.previous_centroids || [];
  const ellipses = currentStepData.ellipses_2d || [];
  const activePoint = currentStepData.current_point_coord || null;

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border border-[#231542] bg-[#0E091C] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-[#00F0FF]/40 bg-[#0B1226] flex items-center justify-center text-cyan-300 shadow-sm">
              <Play className="w-5 h-5 fill-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-['Press_Start_2P'] text-[10px] text-[#00F0FF]">STAGE 3</span>
                <h1 className="font-['Silkscreen'] text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Step-by-Step Simulation
                </h1>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 font-sans">
                Interactive step-by-step playback of centroid migration, cluster reassignments, and convergence dynamics.
              </p>
            </div>
          </div>

          <PixelBadge variant="cyan">
            {selectedAlgorithm.toUpperCase()}
          </PixelBadge>
        </div>
      </div>

      {/* Playback Scrubber & Navigation Controls */}
      <StepperControls />

      {/* Convergence Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400 block">PHASE:</span>
          <span className="font-bold text-[#00F0FF] text-xs mt-0.5 block truncate">
            {currentStepData.phase_name || currentStepData.phase}
          </span>
        </div>

        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400 block">ITERATION:</span>
          <span className="font-mono font-bold text-xs text-yellow-300 mt-0.5 block">
            {currentStepData.iteration || 0} / {simulationResult.total_iterations}
          </span>
        </div>

        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400 block">
            {currentStepData.wcss !== undefined ? 'WCSS (INERTIA):' : currentStepData.log_likelihood !== undefined ? 'LOG-LIKELIHOOD:' : 'CLUSTERS:'}
          </span>
          <span className="font-bold text-[#39FF14] text-xs mt-0.5 block">
            {currentStepData.wcss !== undefined
              ? currentStepData.wcss.toFixed(2)
              : currentStepData.log_likelihood !== undefined
              ? currentStepData.log_likelihood.toFixed(2)
              : simulationResult.metrics?.num_clusters || 0}
          </span>
        </div>

        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400 block">STATUS:</span>
          <span className={`font-mono font-bold text-xs mt-0.5 block ${currentStepData.converged ? 'text-[#39FF14]' : 'text-amber-400'}`}>
            {currentStepData.converged ? 'CONVERGED' : 'ITERATING'}
          </span>
        </div>
      </div>

      {/* Primary Clustering Plot Viewport */}
      <div className="border border-[#20133A] bg-[#080512] p-2.5 sm:p-3 shadow-sm">
        <div className="h-[490px] w-full">
          <PlotlyWrapper
            points={points}
            labels={labels}
            centroids={centroids}
            previousCentroids={previousCentroids}
            ellipses={ellipses}
            activePoint={activePoint}
            featureNames={featureNames}
            title={`Step ${currentStepIndex + 1}/${simulationResult.steps.length}: ${currentStepData.phase_name || currentStepData.phase}`}
            height={480}
          />
        </div>
      </div>

      {/* Convergence Curve Plot (WCSS / Log-Likelihood) */}
      {selectedAlgorithm !== 'dbscan' && (
        <div className="border border-[#20133A] bg-[#0E091C] p-3 sm:p-4 shadow-sm">
          <ConvergencePlot
            steps={simulationResult.steps}
            algorithmType={selectedAlgorithm}
            height={190}
          />
        </div>
      )}

      {/* Collapsible Technical Details & Mathematical Formulation */}
      <details className="border border-[#20133A] bg-[#0E091C] p-3 sm:p-4 shadow-sm cursor-pointer group">
        <summary className="font-['Silkscreen'] text-xs font-bold text-[#00F0FF] uppercase flex items-center justify-between list-none select-none">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-[#00F0FF]" />
            <span>Algorithm Mechanics & Active Mathematical Formulation</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
        </summary>

        <div className="pt-3 space-y-3 border-t border-[#1E1136] mt-2.5 cursor-default">
          <div className="p-3 border border-[#1E1136] bg-[#080512] space-y-1">
            <span className="font-['Silkscreen'] text-[10px] text-gray-400 uppercase">Phase Explanation:</span>
            <p className="text-xs text-gray-200 leading-relaxed font-sans">
              {currentStepData.explanation}
            </p>
          </div>

          {currentStepData.math_formula && (
            <MathBlock
              title="Active Mathematical Formulation"
              formula={currentStepData.math_formula}
              description="Theoretical formulation governing this iteration update."
            />
          )}
        </div>
      </details>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E1136]">
        <PixelButton
          variant="dark"
          size="md"
          onClick={prevStep}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          PREV [PARAMETERS]
        </PixelButton>

        <PixelButton
          variant="cyan"
          size="md"
          onClick={nextStep}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          NEXT: ANALYZE RESULTS [STAGE 4]
        </PixelButton>
      </div>
    </div>
  );
};

export default Step7_StepByStepExecution;
