import React, { useEffect } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { History, ArrowLeft, RotateCcw, Printer, FileText, Database } from 'lucide-react';

export const Step11_ExperimentHistory = () => {
  const {
    historyList,
    loadHistory,
    activeExperiment,
    simulationResult,
    selectedDatasetSlug,
    selectedAlgorithm,
    kmeansParams,
    emParams,
    dbscanParams,
    goToStep,
    prevStep,
  } = useExperiment();

  const [printedAt] = React.useState(() => new Date().toLocaleString());

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handlePrint = () => {
    window.print();
  };

  const getParamsSummary = () => {
    if (selectedAlgorithm === 'kmeans') {
      return `K=${kmeansParams.k}, Init=${kmeansParams.init_method}, MaxIter=${kmeansParams.max_iter}`;
    }
    if (selectedAlgorithm === 'em') {
      return `Components=${emParams.n_components}, Covariance=${emParams.covariance_type}, MaxIter=${emParams.max_iter}`;
    }
    if (selectedAlgorithm === 'dbscan') {
      return `Eps=${dbscanParams.eps}, MinPts=${dbscanParams.min_samples}, Metric=${dbscanParams.metric}`;
    }
    return 'Default Parameters';
  };

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Interactive Header Banner - Hidden in Print */}
      <div className="no-print p-4 sm:p-5 border border-[#231542] bg-[#0E091C] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 border border-[#00F0FF]/40 bg-[#0B1226] flex items-center justify-center text-cyan-300 shadow-sm">
            <History className="w-5 h-5 text-[#00F0FF]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-['Press_Start_2P'] text-[10px] text-[#00F0FF]">STAGE 5</span>
              <h1 className="font-['Silkscreen'] text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                Experiment History & Report
              </h1>
            </div>
            <p className="text-xs text-gray-300 mt-0.5 font-sans">
              Review saved laboratory runs persisted in the database and export the evaluation report as a printable PDF.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <PixelButton
            variant="cyan"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-4 h-4 text-[#050510]" />}
          >
            PRINT / SAVE PDF
          </PixelButton>

          <PixelBadge variant="cyan">
            SAVED RUNS
          </PixelBadge>
        </div>
      </div>

      {/* Formal Printable Document Header (Optimized for PDF / Print Output) */}
      <div className="hidden print:block mb-6 border-b-2 border-gray-800 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-black uppercase">
              ClusterLab — Machine Learning Virtual Laboratory
            </h1>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">
              Official Student Laboratory Experiment Dossier & Evaluation Report
            </p>
          </div>
          <div className="text-right text-xs font-mono text-gray-600">
            <div>Printed: {printedAt}</div>
            <div>Student Account: guest_student</div>
          </div>
        </div>
      </div>

      {/* Printable Current Lab Session Summary Card */}
      {activeExperiment && simulationResult ? (
        <div className="print-card border border-[#00F0FF]/40 bg-[#0C152B] p-5 shadow-sm space-y-4 break-inside-avoid">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-[#00F0FF]/20">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#00F0FF] print:text-black" />
              <h2 className="font-['Silkscreen'] print:font-sans print:font-bold text-sm sm:text-base font-bold text-white print:text-black uppercase tracking-wide">
                Virtual Lab Experiment Dossier
              </h2>
            </div>
            <span className="font-mono text-xs text-gray-400 print:text-gray-700">
              SESSION ID: <strong className="text-cyan-300 print:text-black">{activeExperiment.session_id}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="border border-[#20133A] print:border-gray-300 bg-[#080512] print:bg-gray-50 p-2.5">
              <span className="text-gray-400 print:text-gray-600 block font-['Silkscreen'] print:font-sans text-[9px] uppercase">
                DATASET:
              </span>
              <span className="font-bold text-gray-200 print:text-black uppercase mt-0.5 block truncate">
                {selectedDatasetSlug ? selectedDatasetSlug.replace('synthetic_', '').replace('_', ' ') : 'IRIS'}
              </span>
            </div>
            <div className="border border-[#20133A] print:border-gray-300 bg-[#080512] print:bg-gray-50 p-2.5">
              <span className="text-gray-400 print:text-gray-600 block font-['Silkscreen'] print:font-sans text-[9px] uppercase">
                LOADED FEATURES:
              </span>
              <span className="font-bold text-gray-200 print:text-black mt-0.5 block truncate">
                {activeExperiment.selected_features.join(', ')}
              </span>
            </div>
            <div className="border border-[#20133A] print:border-gray-300 bg-[#080512] print:bg-gray-50 p-2.5">
              <span className="text-gray-400 print:text-gray-600 block font-['Silkscreen'] print:font-sans text-[9px] uppercase">
                NORMALIZATION:
              </span>
              <span className="font-bold text-gray-200 print:text-black uppercase mt-0.5 block">
                {activeExperiment.scaling_method}
              </span>
            </div>
            <div className="border border-[#20133A] print:border-gray-300 bg-[#080512] print:bg-gray-50 p-2.5">
              <span className="text-gray-400 print:text-gray-600 block font-['Silkscreen'] print:font-sans text-[9px] uppercase">
                PARADIGM:
              </span>
              <span className="font-bold text-[#00F0FF] print:text-black uppercase mt-0.5 block">
                {selectedAlgorithm}
              </span>
            </div>
          </div>

          {/* Hyperparameters Line */}
          <div className="text-xs font-mono p-2 bg-[#080512] print:bg-gray-100 border border-[#20133A] print:border-gray-300 flex items-center justify-between">
            <span className="text-gray-400 print:text-gray-600">Configuration Parameters:</span>
            <span className="text-yellow-300 print:text-black font-semibold">{getParamsSummary()}</span>
          </div>

          {/* Quantitative Metrics Summary Table */}
          <div className="overflow-x-auto border border-[#1E1136] print:border-gray-300 bg-[#07040E] print:bg-white mt-3">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-gray-400 print:text-black uppercase bg-[#090514] print:bg-gray-100 font-['Silkscreen'] print:font-sans border-b border-[#1E1136] print:border-gray-300">
                <tr>
                  <th className="px-3 py-2">SILHOUETTE (↑)</th>
                  <th className="px-3 py-2">DAVIES-BOULDIN (↓)</th>
                  <th className="px-3 py-2">CALINSKI-H (↑)</th>
                  <th className="px-3 py-2">CLUSTERS (K)</th>
                  <th className="px-3 py-2">NOISE PTS</th>
                  <th className="px-3 py-2">ITERATIONS</th>
                  <th className="px-3 py-2">RUNTIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#180E2B] print:divide-gray-200 text-gray-200 print:text-black">
                <tr>
                  <td className="px-3 py-2 text-[#00F0FF] print:text-black font-bold">
                    {simulationResult.metrics.silhouette_score !== null && simulationResult.metrics.silhouette_score !== undefined
                      ? simulationResult.metrics.silhouette_score.toFixed(4)
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-2 text-[#D8B4FE] print:text-black font-semibold">
                    {simulationResult.metrics.davies_bouldin_index !== null && simulationResult.metrics.davies_bouldin_index !== undefined
                      ? simulationResult.metrics.davies_bouldin_index.toFixed(4)
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-2 text-[#39FF14] print:text-black">
                    {simulationResult.metrics.calinski_harabasz_index !== null && simulationResult.metrics.calinski_harabasz_index !== undefined
                      ? simulationResult.metrics.calinski_harabasz_index.toFixed(1)
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-2">{simulationResult.metrics.num_clusters}</td>
                  <td className="px-3 py-2">{simulationResult.metrics.num_noise_points || 0}</td>
                  <td className="px-3 py-2">{simulationResult.total_iterations}</td>
                  <td className="px-3 py-2 text-yellow-400 print:text-black">{simulationResult.execution_time_ms} ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="no-print border border-[#20133A] bg-[#0E091C] p-6 text-center text-gray-400 space-y-2">
          <p className="font-['Silkscreen'] text-xs">NO ACTIVE EXPERIMENT IN PROGRESS</p>
          <p className="text-xs font-sans text-gray-500">Launch a simulation in Step 06 or Step 07 to record live dossier metrics.</p>
        </div>
      )}

      {/* Database Past Experiments History List */}
      <div className="print-card border border-[#20133A] bg-[#0E091C] p-4 sm:p-5 shadow-sm space-y-4 break-inside-avoid">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-[#1E1136] print:border-gray-300">
          <Database className="w-4 h-4 text-[#00F0FF] print:text-black" />
          <h3 className="font-['Silkscreen'] print:font-sans print:font-bold text-xs font-bold text-white print:text-black uppercase tracking-wider">
            Saved Experiments Database Archive ({historyList.length} Sessions Recorded)
          </h3>
        </div>

        {historyList.length > 0 ? (
          <div className="space-y-2.5">
            {historyList.map((exp) => (
              <div
                key={exp.id}
                className="p-3 border border-[#20133A] print:border-gray-300 bg-[#0A0617] print:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3A2269] transition-all break-inside-avoid shadow-sm"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-['Silkscreen'] print:font-sans font-bold text-xs text-white print:text-black">
                      {exp.title}
                    </h4>
                    <span className="px-2 py-0.5 text-[10px] font-mono border border-[#00F0FF]/40 print:border-gray-400 bg-[#00F0FF]/10 print:bg-gray-100 text-[#00F0FF] print:text-black uppercase font-bold">
                      {exp.dataset_slug}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 print:text-gray-600 mt-1 font-mono">
                    Features: {exp.selected_features?.join(', ')} • Scaling: {exp.scaling_method} •{' '}
                    {new Date(exp.created_at).toLocaleDateString()} {new Date(exp.created_at).toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[11px] text-[#39FF14] print:text-emerald-800 font-mono font-bold">
                    {exp.experiment_runs?.length || 0} RUNS RECORDED
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 text-xs font-['Silkscreen'] print:font-sans">
            NO PRIOR EXPERIMENT RECORDS IN DATABASE ARCHIVE.
          </div>
        )}
      </div>

      {/* Navigation Footer - Hidden in Print */}
      <div className="no-print flex items-center justify-between pt-4 border-t border-[#1E1136]">
        <PixelButton
          variant="dark"
          size="md"
          onClick={prevStep}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          PREV [COMPARISON]
        </PixelButton>

        <PixelButton
          variant="cyan"
          size="md"
          onClick={() => goToStep(1)}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          START NEW EXPERIMENT [STAGE 1]
        </PixelButton>
      </div>
    </div>
  );
};

export default Step11_ExperimentHistory;
