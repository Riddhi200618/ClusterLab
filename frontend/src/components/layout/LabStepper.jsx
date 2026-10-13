import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import {
  BookOpen,
  FolderOpen,
  TableProperties,
  Sliders,
  Cpu,
  Settings2,
  Play,
  Eye,
  CheckSquare,
  GitCompare,
  History,
  Check,
  ChevronRight
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Theory', icon: BookOpen, desc: 'Clustering Principles' },
  { id: 2, label: 'Dataset', icon: FolderOpen, desc: 'Real & Synthetic' },
  { id: 3, label: 'Preview', icon: TableProperties, desc: 'Summary & Distributions' },
  { id: 4, label: 'Features', icon: Sliders, desc: 'Selection & Scaling' },
  { id: 5, label: 'Algorithm', icon: Cpu, desc: 'K-Means, EM, DBSCAN' },
  { id: 6, label: 'Parameters', icon: Settings2, desc: 'Hyperparameter Tuning' },
  { id: 7, label: 'Simulation', icon: Play, desc: 'Step-by-Step Playback' },
  { id: 8, label: 'Visual Canvas', icon: Eye, desc: 'Dynamic Clusters' },
  { id: 9, label: 'Evaluation', icon: CheckSquare, desc: 'Silhouette Analysis' },
  { id: 10, label: 'Comparison', icon: GitCompare, desc: '3-Way Comparison' },
  { id: 11, label: 'History', icon: History, desc: 'Saved Lab Runs' },
];

export const LabStepper = () => {
  const { currentStep, completedSteps, goToStep } = useExperiment();

  return (
    <div className="w-full bg-[#0D1322]/90 border-b border-gray-800/80 px-4 py-3 sticky top-16 z-40 overflow-x-auto shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[900px] space-x-1">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.has(step.id) && !isActive;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => goToStep(step.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-cyan-400/40'
                    : isCompleted
                    ? 'bg-gray-800/60 text-emerald-400 hover:bg-gray-700/60 border border-emerald-500/20'
                    : 'bg-gray-900/40 text-gray-400 hover:bg-gray-800/40 hover:text-gray-300 border border-gray-800/40'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-white text-indigo-700'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : step.id}
                </div>

                <span className="whitespace-nowrap font-semibold">{step.label}</span>

                {/* Micro tooltip on hover */}
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-gray-900 text-gray-300 text-[10px] px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700 z-50">
                  {step.desc}
                </span>
              </button>

              {index < STEPS.length - 1 && (
                <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${
                  currentStep > step.id ? 'text-indigo-400/60' : 'text-gray-700'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default LabStepper;
