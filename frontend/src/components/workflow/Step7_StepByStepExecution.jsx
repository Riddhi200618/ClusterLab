import React, { useMemo } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PlotlyWrapper } from '../visualization/PlotlyWrapper';
import { StepperControls } from '../visualization/StepperControls';
import { ConvergencePlot } from '../visualization/ConvergencePlot';
import { MathBlock } from '../common/MathBlock';
import { Play, ArrowRight, ArrowLeft, Cpu, Activity, Info, BarChart3 } from 'lucide-react';

export const Step7_StepByStepExecution = () => {
  const {
    activeExperiment,
    selectedAlgorithm,
    simulationResult,
    currentStepIndex,
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
      <div className="glass-panel p-8 text-center text-gray-400 rounded-xl max-w-4xl mx-auto my-12">
        <p>Simulation data is currently loading or was not executed yet.</p>
        <button
          onClick={prevStep}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
        >
          Go Back to Parameters
        </button>
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
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Play className="w-5 h-5 fill-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Step 7: Step-by-Step Algorithm Simulation
            </h1>
            <p className="text-xs text-gray-300">
              Scrub, play, and observe internal algorithm operations, centroid adjustments, and cluster assignments.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-xs font-mono uppercase bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700 font-bold">
            {selectedAlgorithm}
          </span>
        </div>
      </div>

      {/* Playback Controls Component */}
      <StepperControls />

      {/* Main Simulation Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive Scatter Canvas */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="h-[460px] w-full">
            <PlotlyWrapper
              points={points}
              labels={labels}
              centroids={centroids}
              previousCentroids={previousCentroids}
              ellipses={ellipses}
              activePoint={activePoint}
              featureNames={featureNames}
              title={`Simulation Frame (Step ${currentStepIndex + 1}): ${currentStepData.phase_name}`}
              height={450}
            />
          </div>

          {/* Convergence Plot under canvas */}
          {selectedAlgorithm !== 'dbscan' && (
            <ConvergencePlot
              steps={simulationResult.steps}
              algorithmType={selectedAlgorithm}
              height={200}
            />
          )}
        </div>

        {/* Right 4 Cols: Mathematical Inspector & Educational Explanation */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Phase Explanation Card */}
          <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-cyan-950/20 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Step Mechanics</span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed font-sans">
              {currentStepData.explanation}
            </p>
          </div>

          {/* Active Mathematical Formula */}
          <MathBlock
            title="Active LaTeX Formulation"
            formula={currentStepData.math_formula}
            description="Theoretical equation governing this simulation state."
          />

          {/* Iteration Metrics Inspector */}
          <div className="p-4 rounded-xl glass-panel border border-gray-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase">
              <span>Simulation State</span>
              <span className="text-gray-500 font-mono">Iteration {currentStepData.iteration || 0}</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Phase:</span>
                <span className="text-indigo-300 font-semibold">{currentStepData.phase}</span>
              </div>

              {currentStepData.wcss !== undefined && (
                <div className="flex justify-between py-1 border-b border-gray-800">
                  <span className="text-gray-400">WCSS (Inertia):</span>
                  <span className="text-cyan-300">{currentStepData.wcss.toFixed(2)}</span>
                </div>
              )}

              {currentStepData.delta_wcss !== undefined && currentStepData.delta_wcss !== null && (
                <div className="flex justify-between py-1 border-b border-gray-800">
                  <span className="text-gray-400">Δ WCSS:</span>
                  <span className={currentStepData.delta_wcss <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {currentStepData.delta_wcss.toFixed(2)}
                  </span>
                </div>
              )}

              {currentStepData.log_likelihood !== undefined && (
                <div className="flex justify-between py-1 border-b border-gray-800">
                  <span className="text-gray-400">Log-Likelihood:</span>
                  <span className="text-emerald-300">{currentStepData.log_likelihood.toFixed(2)}</span>
                </div>
              )}

              {currentStepData.delta_log_likelihood !== undefined && currentStepData.delta_log_likelihood !== null && (
                <div className="flex justify-between py-1 border-b border-gray-800">
                  <span className="text-gray-400">Δ Log-Likelihood:</span>
                  <span className="text-emerald-400">+{currentStepData.delta_log_likelihood.toFixed(4)}</span>
                </div>
              )}

              <div className="flex justify-between py-1">
                <span className="text-gray-400">Convergence Flag:</span>
                <span className={currentStepData.converged ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {currentStepData.converged ? 'TRUE (Converged)' : 'FALSE (Iterating)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Parameters</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <span>Expanded Visualization View</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step7_StepByStepExecution;
