import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import {
  BookOpen,
  Database,
  Play,
  BarChart3,
  FileText,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const STAGES = [
  {
    id: 1,
    stageNum: '1',
    title: 'Learn',
    subtitle: 'Theory & Foundations',
    icon: BookOpen,
    steps: [
      { id: 1, label: 'Theory & Foundations', shortLabel: 'Theory' }
    ]
  },
  {
    id: 2,
    stageNum: '2',
    title: 'Prepare Data',
    subtitle: 'Dataset & Preprocessing',
    icon: Database,
    steps: [
      { id: 2, label: 'Dataset Selection', shortLabel: 'Dataset' },
      { id: 3, label: 'Dataset Preview', shortLabel: 'Preview & Stats' },
      { id: 4, label: 'Features & Scaling', shortLabel: 'Features & Scaling' }
    ]
  },
  {
    id: 3,
    stageNum: '3',
    title: 'Run Experiment',
    subtitle: 'Algorithm & Simulation',
    icon: Play,
    steps: [
      { id: 5, label: 'Algorithm Selection', shortLabel: 'Algorithm' },
      { id: 6, label: 'Parameter Config', shortLabel: 'Parameters' },
      { id: 7, label: 'Step Simulation', shortLabel: 'Simulation' }
    ]
  },
  {
    id: 4,
    stageNum: '4',
    title: 'Analyze Results',
    subtitle: 'Evaluation & Benchmarks',
    icon: BarChart3,
    steps: [
      { id: 8, label: 'Cluster Visualization', shortLabel: 'Visualization' },
      { id: 9, label: 'Evaluation Metrics', shortLabel: 'Evaluation' },
      { id: 10, label: 'Algorithm Comparison', shortLabel: 'Comparison' }
    ]
  },
  {
    id: 5,
    stageNum: '5',
    title: 'Save & Report',
    subtitle: 'Dossier & PDF Export',
    icon: FileText,
    steps: [
      { id: 11, label: 'History & Report', shortLabel: 'Report' }
    ]
  }
];

export const LabStepper = ({ onStepClick }) => {
  const { currentStep, completedSteps, goToStep, nextStep, prevStep } = useExperiment();

  const activeStage = STAGES.find((s) => s.steps.some((st) => st.id === currentStep)) || STAGES[0];
  const activeStepData = activeStage.steps.find((st) => st.id === currentStep) || activeStage.steps[0];

  const handleSelectStage = (stage) => {
    const targetStep = stage.steps.some((st) => st.id === currentStep)
      ? currentStep
      : stage.steps[0].id;
    goToStep(targetStep);
    if (onStepClick) onStepClick(targetStep);
  };

  const handleSelectSubStep = (stepId) => {
    goToStep(stepId);
    if (onStepClick) onStepClick(stepId);
  };

  return (
    <div className="no-print w-full bg-[#080512] border-b border-[#1E1136] shadow-sm sticky top-14 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 space-y-1.5">
        {/* Top Status HUD: Stage & Step Indicators + Prev / Next */}
        <div className="flex items-center justify-between gap-2 border-b border-[#1E1136] pb-1.5 text-xs">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <span className="font-['Press_Start_2P'] text-[10px] text-[#00F0FF] flex-shrink-0">
              STAGE {activeStage.stageNum}/5
            </span>
            <span className="text-gray-500 font-mono hidden sm:inline flex-shrink-0">::</span>
            <span className="font-['Silkscreen'] font-bold text-white uppercase tracking-wider truncate">
              {activeStage.title}
            </span>
            <span className="text-[11px] text-gray-400 hidden md:inline font-sans truncate">
              — {activeStepData.label}
            </span>
          </div>

          {/* Quick Prev / Next Step Controls */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={prevStep}
              disabled={currentStep <= 1}
              className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-['Silkscreen'] uppercase font-bold text-gray-300 hover:text-white bg-[#120B24] hover:bg-[#1A1033] border border-[#2B184C] disabled:opacity-30 disabled:pointer-events-none shadow-sm transition-all"
              title="Previous Step"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PREV</span>
            </button>

            <span className="font-['Press_Start_2P'] text-[9px] text-[#FF2E93] px-1">
              STEP {currentStep}/11
            </span>

            <button
              onClick={nextStep}
              disabled={currentStep >= 11}
              className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-['Silkscreen'] uppercase font-bold text-[#050510] hover:text-black bg-[#00F0FF] hover:bg-[#38BDF8] border border-[#6EE7B7] shadow-sm disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Next Step"
            >
              <span className="hidden sm:inline">NEXT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5-Stage High-Level Progress Track */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
          {STAGES.map((stage) => {
            const isStageActive = activeStage.id === stage.id;
            const isStageCompleted = stage.steps.every((st) => completedSteps.has(st.id)) && !isStageActive;
            const StageIcon = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() => handleSelectStage(stage)}
                title={`Stage ${stage.stageNum}: ${stage.title} (${stage.subtitle})`}
                className={`flex items-center space-x-2 px-2.5 py-1.5 border text-xs transition-all text-left shadow-sm ${
                  isStageActive
                    ? 'bg-[#0B1426] border-[#00F0FF] text-white'
                    : isStageCompleted
                    ? 'bg-[#08150D] border-[#39FF14]/50 text-[#39FF14] hover:border-[#39FF14]'
                    : 'bg-[#0E091C] border-[#20133A] text-gray-400 hover:text-gray-200 hover:border-[#3A2269]'
                }`}
              >
                <div
                  className={`w-4 h-4 flex items-center justify-center font-['Press_Start_2P'] text-[8px] flex-shrink-0 ${
                    isStageActive
                      ? 'text-[#00F0FF]'
                      : isStageCompleted
                      ? 'text-[#39FF14]'
                      : 'text-gray-500'
                  }`}
                >
                  {isStageCompleted ? (
                    <Check className="w-3.5 h-3.5 text-[#39FF14] stroke-[3]" />
                  ) : (
                    <StageIcon className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <span className="font-['Silkscreen'] text-[11px] font-bold truncate">
                      {stage.title}
                    </span>
                  </div>
                  <div className="text-[9px] font-sans text-gray-400 truncate hidden md:block">
                    {stage.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sub-Step Navigation for Multi-Step Stages */}
        {activeStage.steps.length > 1 && (
          <div className="flex items-center space-x-1.5 pt-1 border-t border-[#1E1136] overflow-x-auto">
            <span className="text-[10px] font-mono text-gray-400 uppercase hidden sm:inline flex-shrink-0">
              Stage {activeStage.stageNum} Steps:
            </span>
            {activeStage.steps.map((st, idx) => {
              const isStepActive = currentStep === st.id;
              const isStepDone = completedSteps.has(st.id) && !isStepActive;

              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectSubStep(st.id)}
                  title={st.label}
                  className={`px-2 py-0.5 text-[10px] font-['Silkscreen'] uppercase border transition-all flex items-center space-x-1 flex-shrink-0 shadow-sm ${
                    isStepActive
                      ? 'bg-[#00F0FF]/10 border-[#00F0FF]/80 text-white'
                      : isStepDone
                      ? 'bg-[#08150D] border-[#39FF14]/40 text-[#39FF14] hover:border-[#39FF14]'
                      : 'bg-[#0E091C] border-[#20133A] text-gray-400 hover:text-white hover:border-[#3A2269]'
                  }`}
                >
                  {isStepDone && <Check className="w-2.5 h-2.5 text-[#39FF14] stroke-[3]" />}
                  <span>{idx + 1}. {st.shortLabel}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabStepper;
