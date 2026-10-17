import React, { useMemo } from 'react';
import { PixelCrown } from '../common/PixelIcons';
import { PixelBadge } from '../common/PixelBadge';
import { ShieldCheck, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const ComparisonGrid = ({ comparisonResult }) => {
  const comparison_table = comparisonResult?.comparison_table;

  // Compute best scores across metrics unconditionally
  const bestMetrics = useMemo(() => {
    let maxSil = -Infinity;
    let minDb = Infinity;
    let maxCh = -Infinity;
    let minTime = Infinity;

    if (Array.isArray(comparison_table)) {
      comparison_table.forEach((row) => {
        if (row.silhouette_score !== null && row.silhouette_score > maxSil) {
          maxSil = row.silhouette_score;
        }
        if (row.davies_bouldin_index !== null && row.davies_bouldin_index < minDb) {
          minDb = row.davies_bouldin_index;
        }
        if (row.calinski_harabasz_index !== null && row.calinski_harabasz_index > maxCh) {
          maxCh = row.calinski_harabasz_index;
        }
        if (row.execution_time_ms && row.execution_time_ms < minTime) {
          minTime = row.execution_time_ms;
        }
      });
    }

    return { maxSil, minDb, maxCh, minTime };
  }, [comparison_table]);

  if (!comparisonResult || !comparison_table) return null;

  const { winner_algorithm, educational_summary, dataset_slug } = comparisonResult;

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Educational Narrative Best Performing Algorithm Banner */}
      <div className="p-4 sm:p-5 border border-amber-500/40 bg-[#140F08] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-amber-400/40 bg-[#241A06] flex items-center justify-center text-yellow-300 shadow-sm">
              <PixelCrown className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="font-['Press_Start_2P'] text-[9px] text-yellow-400 uppercase">
                BEST PERFORMING ALGORITHM
              </div>
              <div className="font-['Silkscreen'] text-base sm:text-lg font-bold text-white uppercase tracking-wider mt-0.5">
                {winner_algorithm} on {dataset_slug ? dataset_slug.replace('synthetic_', '').replace('_', ' ') : 'Dataset'}
              </div>
            </div>
          </div>

          <PixelBadge variant="yellow">
            OPTIMAL MODEL
          </PixelBadge>
        </div>

        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mt-2.5 bg-[#090602] p-3 border border-[#2B1F06] font-sans">
          {educational_summary}
        </p>
      </div>

      {/* Explicit Selection Rule & Metric Criteria Banner */}
      <div className="p-3.5 sm:p-4 border border-[#20133A] bg-[#0E091C] space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-['Silkscreen'] text-[#00F0FF] uppercase font-bold">
          <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
          <span>Algorithm Selection Rule & Optimization Criteria</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
          <div className="p-2.5 border border-[#20133A] bg-[#120B24] space-y-1">
            <div className="flex items-center space-x-1.5 font-['Silkscreen'] text-[11px] text-[#00F0FF] font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>1. Silhouette Score</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              <strong>Primary Metric (Higher is Better):</strong> Measures relative intra-cluster cohesion vs separation from nearest neighbors. Range: [-1.0, +1.0].
            </p>
          </div>

          <div className="p-2.5 border border-[#20133A] bg-[#120B24] space-y-1">
            <div className="flex items-center space-x-1.5 font-['Silkscreen'] text-[11px] text-[#D8B4FE] font-bold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>2. Davies-Bouldin Index</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              <strong>Secondary Tie-Breaker (Lower is Better):</strong> Ratio of cluster dispersion to distance between centroids. Values closer to 0.0 indicate tighter, well-separated clusters.
            </p>
          </div>

          <div className="p-2.5 border border-[#20133A] bg-[#120B24] space-y-1">
            <div className="flex items-center space-x-1.5 font-['Silkscreen'] text-[11px] text-[#39FF14] font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>3. Topology Rule</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              <strong>Non-Convex Manifolds:</strong> On non-linear manifolds (e.g. Concentric Rings or Moons), DBSCAN is structurally preferred because distance prototypes mathematically split curved bodies.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Scorecard Table */}
      <div className="overflow-x-auto border border-[#20133A] bg-[#0E091C] shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080512] text-gray-400 font-['Silkscreen'] uppercase border-b border-[#20133A]">
            <tr>
              <th className="px-4 py-2.5">ALGORITHM</th>
              <th className="px-4 py-3">
                <span>SILHOUETTE</span>
                <span className="block text-[9px] text-[#00F0FF] lowercase tracking-normal font-sans">(▲ higher is better)</span>
              </th>
              <th className="px-4 py-3">
                <span>DAVIES-BOULDIN</span>
                <span className="block text-[9px] text-[#D699FF] lowercase tracking-normal font-sans">(▼ lower is better)</span>
              </th>
              <th className="px-4 py-3">
                <span>CALINSKI-HARABASZ</span>
                <span className="block text-[9px] text-[#39FF14] lowercase tracking-normal font-sans">(▲ higher is better)</span>
              </th>
              <th className="px-4 py-3">CLUSTERS</th>
              <th className="px-4 py-3">NOISE PTS</th>
              <th className="px-4 py-3">RUNTIME</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1D1036] font-mono text-xs">
            {comparison_table.map((row) => {
              const isWinner = row.algorithm_type === winner_algorithm;
              const isBestSil = row.silhouette_score !== null && row.silhouette_score === bestMetrics.maxSil;
              const isBestDb = row.davies_bouldin_index !== null && row.davies_bouldin_index === bestMetrics.minDb;
              const isBestCh = row.calinski_harabasz_index !== null && row.calinski_harabasz_index === bestMetrics.maxCh;

              return (
                <tr
                  key={row.algorithm_type}
                  className={
                    isWinner
                      ? 'bg-[#1C1808]/40 border-l-4 border-l-[#FFE600] font-semibold'
                      : 'hover:bg-[#181133]'
                  }
                >
                  <td className="px-4 py-3 font-sans font-bold text-gray-200 flex items-center space-x-2">
                    {isWinner && (
                      <span className="text-yellow-400 font-['Press_Start_2P'] text-[9px]">★</span>
                    )}
                    <span className="font-['Silkscreen'] text-white">{row.algorithm_name}</span>
                    {isWinner && (
                      <span className="px-1.5 py-0.2 text-[8px] font-['Press_Start_2P'] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                        BEST MODEL
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 border ${
                        row.silhouette_score === null
                          ? 'border-[#2D1B54] bg-black/40 text-gray-400'
                          : row.silhouette_score > 0.5
                          ? 'border-[#39FF14]/50 bg-[#0B1E12] text-[#39FF14]'
                          : row.silhouette_score > 0.25
                          ? 'border-[#FFE600]/50 bg-[#1C1808] text-yellow-300'
                          : 'border-[#FF2E93]/50 bg-[#220B16] text-[#FF2E93]'
                      }`}
                    >
                      {row.silhouette_score !== null ? row.silhouette_score.toFixed(4) : 'N/A'}
                      {isBestSil && <span className="ml-1 text-[9px] text-[#00F0FF]">★</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 border ${
                        row.davies_bouldin_index === null
                          ? 'border-[#2D1B54] bg-black/40 text-gray-400'
                          : row.davies_bouldin_index < 0.5
                          ? 'border-[#39FF14]/50 bg-[#0B1E12] text-[#39FF14]'
                          : row.davies_bouldin_index < 1.0
                          ? 'border-[#FFE600]/50 bg-[#1C1808] text-yellow-300'
                          : 'border-[#FF2E93]/50 bg-[#220B16] text-[#FF2E93]'
                      }`}
                    >
                      {row.davies_bouldin_index !== null ? row.davies_bouldin_index.toFixed(4) : 'N/A'}
                      {isBestDb && <span className="ml-1 text-[9px] text-[#D699FF]">★</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    <span>
                      {row.calinski_harabasz_index !== null ? row.calinski_harabasz_index.toFixed(1) : 'N/A'}
                      {isBestCh && <span className="ml-1 text-[9px] text-[#39FF14]">★</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-200">{row.num_clusters}</td>
                  <td className="px-4 py-3 text-gray-400">{row.num_noise_points}</td>
                  <td className="px-4 py-3 text-[#00F0FF]">
                    {row.execution_time_ms ? row.execution_time_ms.toFixed(1) : '0.0'} ms
                  </td>
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
