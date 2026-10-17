import React, { useState } from 'react';
import { ExperimentProvider, useExperiment } from './context/ExperimentContext';
import { Navbar } from './components/layout/Navbar';
import { LabStepper } from './components/layout/LabStepper';
import { WelcomeScreen } from './components/layout/WelcomeScreen';
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
import { X, ShieldAlert } from 'lucide-react';

const LabContent = () => {
  const { currentStep, error, setError } = useExperiment();
  const [showWelcome, setShowWelcome] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-pixel-grid text-gray-100 selection:bg-[#FF2E93] selection:text-white font-sans">
      <Navbar
        showWelcome={showWelcome}
        onToggleWelcome={(val) => setShowWelcome(val)}
      />

      {showWelcome ? (
        <main className="flex-1">
          <WelcomeScreen onStartLab={() => setShowWelcome(false)} />
        </main>
      ) : (
        <>
          <LabStepper onStepClick={() => setShowWelcome(false)} />

          {/* Global Error Banner */}
          {error && (
            <div className="max-w-5xl mx-auto w-full px-4 mt-4 no-print">
              <div className="p-3 border border-[#FF2E93]/60 bg-[#1A0813] text-[#FFA1CE] shadow-sm flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-[#FF2E93]" />
                  <span>ERROR: {error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="p-1 hover:bg-[#3D1427] text-[#FF2E93] transition-all"
                  title="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Main Step Container */}
          <main className="flex-1 px-3 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
            {renderStep()}
          </main>
        </>
      )}

      {/* Retro Arcade Footer */}
      <footer className="border-t border-[#1C1032] py-4 bg-[#080512] text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-['Silkscreen'] font-bold text-gray-300">
              CLUSTER<span className="text-[#00F0FF]">LAB</span> © 2026
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-[11px] text-gray-400 font-mono">
              VIRTUAL MACHINE LEARNING LABORATORY • EDUCATIONAL VIVA EDITION
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[10px] font-mono text-gray-400">
            <span className="text-[#00F0FF]">K-MEANS</span>
            <span className="text-gray-700">/</span>
            <span className="text-[#39FF14]">EM-GMM</span>
            <span className="text-gray-700">/</span>
            <span className="text-[#FF2E93]">DBSCAN</span>
            <span className="text-gray-700">/</span>
            <span className="text-amber-400">SILHOUETTE</span>
          </div>
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
