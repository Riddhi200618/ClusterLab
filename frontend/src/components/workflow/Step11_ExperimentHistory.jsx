import React, { useEffect } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { History, ArrowLeft, RotateCcw, Printer, FileText, CheckCircle, Database, Cpu, Award } from 'lucide-react';

export const Step11_ExperimentHistory = () => {
  const {
    historyList,
    loadHistory,
    activeExperiment,
    simulationResult,
    selectedDatasetSlug,
    selectedAlgorithm,
    goToStep,
    prevStep,
  } = useExperiment();

  useEffect(() => {
    loadHistory();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Step 11: Experiment History & Lab Report</h1>
            <p className="text-xs text-gray-300">Review saved runs persisted in Supabase PostgreSQL and export student laboratory report.</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 shadow-md transition-all"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Print / Export Lab Report</span>
        </button>
      </div>

      {/* Printable Current Lab Session Summary Card */}
      {activeExperiment && simulationResult && (
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 bg-gray-900/90 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Student Lab Experiment Report</h2>
            </div>
            <span className="text-xs font-mono text-gray-400">
              Session ID: <strong className="text-gray-200">{activeExperiment.session_id}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-500 block">Dataset</span>
              <span className="font-bold text-gray-200 uppercase">{selectedDatasetSlug.replace('synthetic_', '')}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Features</span>
              <span className="font-bold text-gray-200">{activeExperiment.selected_features.join(', ')}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Scaling Method</span>
              <span className="font-bold text-gray-200 uppercase">{activeExperiment.scaling_method}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Primary Algorithm</span>
              <span className="font-bold text-cyan-400 uppercase">{selectedAlgorithm}</span>
            </div>
          </div>

          {/* Quantitative Metrics Summary Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-black/40 mt-3">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-400 uppercase bg-gray-900/60 font-mono">
                <tr>
                  <th className="px-4 py-2.5">Silhouette Score</th>
                  <th className="px-4 py-2.5">Davies-Bouldin</th>
                  <th className="px-4 py-2.5">Calinski-Harabasz</th>
                  <th className="px-4 py-2.5">Total Clusters</th>
                  <th className="px-4 py-2.5">Total Iterations</th>
                  <th className="px-4 py-2.5">Execution Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 font-mono text-gray-200">
                <tr>
                  <td className="px-4 py-2.5 text-cyan-300 font-bold">
                    {simulationResult.metrics.silhouette_score !== null
                      ? simulationResult.metrics.silhouette_score.toFixed(4)
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-2.5 text-purple-300">
                    {simulationResult.metrics.davies_bouldin_index !== null
                      ? simulationResult.metrics.davies_bouldin_index.toFixed(4)
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-2.5 text-emerald-300">
                    {simulationResult.metrics.calinski_harabasz_index !== null
                      ? simulationResult.metrics.calinski_harabasz_index.toFixed(1)
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-2.5">{simulationResult.metrics.num_clusters}</td>
                  <td className="px-4 py-2.5">{simulationResult.total_iterations}</td>
                  <td className="px-4 py-2.5 text-cyan-400">{simulationResult.execution_time_ms} ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Database Past Experiments History List */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-800">
          <Database className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Database Saved History ({historyList.length} Experiments)
          </h3>
        </div>

        {historyList.length > 0 ? (
          <div className="space-y-3">
            {historyList.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-700 transition-all"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-gray-100">{exp.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-cyan-300 uppercase">
                      {exp.dataset_slug}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    Features: {exp.selected_features?.join(', ')} • Scaling: {exp.scaling_method} •{' '}
                    {new Date(exp.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-400 font-mono">
                    {exp.experiment_runs?.length || 0} runs recorded
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 text-xs">
            No saved experiments found in database history yet.
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Comparison</span>
        </button>

        <button
          onClick={() => goToStep(1)}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-600/30 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Experiment</span>
        </button>
      </div>
    </div>
  );
};

export default Step11_ExperimentHistory;
