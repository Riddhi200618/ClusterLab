import React from 'react';
import { ExperimentProvider, useExperiment } from './context/ExperimentContext';
import { Navbar } from './components/layout/Navbar';
import { LabStepper } from './components/layout/LabStepper';
import { Step1_Theory } from './components/workflow/Step1_Theory';
import { Step2_DatasetSelection } from './components/workflow/Step2_DatasetSelection';
import { Step3_DatasetPreview } from './components/workflow/Step3_DatasetPreview';
import { Step4_FeatureSelection } from './components/workflow/Step4_FeatureSelection';
import { Step5_AlgorithmSelection } from './components/workflow/Step5_AlgorithmSelection';
import { Step6_ParameterConfig } from './components/workflow/Step6_ParameterConfig';
import { Step7_StepByStepExecution } from './components/workflow/Step7_StepByStepExecution';
import { Step8_InteractiveViz } from './components/workflow/Step8_InteractiveViz';
import { Step9_ClusteringEvaluation } from './components/workflow/Step9_ClusteringEvaluation';
import { Step10_AlgorithmComparison } from './components/workflow/Step10_AlgorithmComparison';
import { Step11_ExperimentHistory } from './components/workflow/Step11_ExperimentHistory';
import { AlertCircle, X } from 'lucide-react';

const LabContent = () => {
  const { currentStep, error, setError } = useExperiment();

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1_Theory />;
      case 2: return <Step2_DatasetSelection />;
      case 3: return <Step3_DatasetPreview />;
      case 4: return <Step4_FeatureSelection />;
      case 5: return <Step5_AlgorithmSelection />;
      case 6: return <Step6_ParameterConfig />;
      case 7: return <Step7_StepByStepExecution />;
      case 8: return <Step8_InteractiveViz />;
      case 9: return <Step9_ClusteringEvaluation />;
      case 10: return <Step10_AlgorithmComparison />;
      case 11: return <Step11_ExperimentHistory />;
      default: return <Step1_Theory />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-gray-100">
      <Navbar />
      <LabStepper />

      {/* Global Error Banner */}
      {error && (
        <div className="max-w-5xl mx-auto w-full px-4 mt-4">
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1 hover:bg-rose-900/50 rounded transition-all text-rose-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Step Container */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-16">
        {renderStep()}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-6 text-center text-xs text-gray-500 glass-panel bg-black/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ClusterLab © 2026 — Interactive Machine Learning Virtual Laboratory</span>
          <span className="text-gray-600 font-mono">K-Means • EM / GMM • DBSCAN • Silhouette Evaluation</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ExperimentProvider>
      <LabContent />
    </ExperimentProvider>
  );
}
