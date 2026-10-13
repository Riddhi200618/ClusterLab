import React from 'react';
import { PlotlyWrapper } from './PlotlyWrapper';
import { Trophy, CheckCircle2, Zap, AlertTriangle } from 'lucide-react';

export const ComparisonGrid = ({ comparisonResult, points = [], featureNames = ['Feature 1', 'Feature 2'] }) => {
  if (!comparisonResult || !comparisonResult.comparison_table) return null;

  const { comparison_table, winner_algorithm, educational_summary, dataset_slug } = comparisonResult;

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Educational Narrative Winner Banner */}
      <div className="p-5 rounded-2xl glass-panel border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-amber-400">Best Performing Algorithm</div>
            <div className="text-lg font-bold text-white uppercase tracking-tight">
              {winner_algorithm} on {dataset_slug.replace('synthetic_', '').replace('_', ' ')}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mt-2 bg-black/30 p-3 rounded-xl border border-white/5">
          {educational_summary}
        </p>
      </div>

      {/* Comparison Scorecard Table */}
      <div className="overflow-x-auto rounded-xl glass-panel border border-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-900/80 text-gray-400 text-xs uppercase border-b border-gray-800">
            <tr>
              <th className="px-4 py-3">Algorithm</th>
              <th className="px-4 py-3">Silhouette Score</th>
              <th className="px-4 py-3">Davies-Bouldin</th>
              <th className="px-4 py-3">Calinski-Harabasz</th>
              <th className="px-4 py-3">Clusters</th>
              <th className="px-4 py-3">Noise Points</th>
              <th className="px-4 py-3">Execution Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 font-mono text-xs">
            {comparison_table.map((row) => {
              const isWinner = row.algorithm_type === winner_algorithm;
              return (
                <tr key={row.algorithm_type} className={isWinner ? 'bg-indigo-950/30 font-semibold' : 'hover:bg-gray-800/30'}>
                  <td className="px-4 py-3 font-sans font-bold text-gray-200 flex items-center space-x-2">
                    {isWinner && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    <span>{row.algorithm_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded ${
                      row.silhouette_score > 0.5 ? 'bg-emerald-500/20 text-emerald-300' :
                      row.silhouette_score > 0.25 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {row.silhouette_score !== null ? row.silhouette_score.toFixed(4) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {row.davies_bouldin_index !== null ? row.davies_bouldin_index.toFixed(4) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {row.calinski_harabasz_index !== null ? row.calinski_harabasz_index.toFixed(1) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-200">{row.num_clusters}</td>
                  <td className="px-4 py-3 text-gray-400">{row.num_noise_points}</td>
                  <td className="px-4 py-3 text-cyan-400">{row.execution_time_ms.toFixed(1)} ms</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonGrid;
