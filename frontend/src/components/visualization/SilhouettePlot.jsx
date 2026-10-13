import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';

const CLUSTER_COLORS = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
];

export const SilhouettePlot = ({ silhouetteData, height = 400 }) => {
  if (!silhouetteData || !silhouetteData.samples || silhouetteData.samples.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-gray-400 rounded-xl">
        <p>No silhouette data available. Run an algorithm with at least 2 clusters to compute Silhouette Scores.</p>
      </div>
    );
  }

  const { overall_score, per_cluster_scores, cluster_sizes, samples, verdict, explanation } = silhouetteData;

  const plotTraces = useMemo(() => {
    // Group samples by cluster_id
    const clusterMap = {};
    samples.forEach((s) => {
      if (!clusterMap[s.cluster_id]) clusterMap[s.cluster_id] = [];
      clusterMap[s.cluster_id].push(s.silhouette_value);
    });

    const traces = [];
    let currentY = 10;
    const gap = 15;

    Object.keys(clusterMap)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .forEach((cIdStr) => {
        const cId = parseInt(cIdStr, 10);
        const values = clusterMap[cId].sort((a, b) => a - b);
        const yCoords = [];

        for (let i = 0; i < values.length; i++) {
          yCoords.push(currentY + i);
        }

        const color = CLUSTER_COLORS[cId % CLUSTER_COLORS.length];

        traces.push({
          type: 'bar',
          orientation: 'h',
          x: values,
          y: yCoords,
          name: `Cluster ${cId + 1} (Mean: ${per_cluster_scores[cIdStr] || 0})`,
          marker: {
            color,
            width: 1,
          },
          hoverinfo: 'x+name',
        });

        currentY += values.length + gap;
      });

    return traces;
  }, [samples, per_cluster_scores]);

  const layout = useMemo(() => {
    return {
      title: {
        text: `Silhouette Analysis (Overall Score: ${overall_score !== null ? overall_score.toFixed(3) : 'N/A'})`,
        font: { color: '#F3F4F6', size: 14 },
      },
      autosize: true,
      height,
      margin: { l: 60, r: 25, t: 40, b: 45 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(15, 23, 42, 0.5)',
      showlegend: true,
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1.02,
        xanchor: 'right',
        x: 1,
        font: { color: '#9CA3AF', size: 10 },
      },
      xaxis: {
        title: { text: 'Silhouette Coefficient s(i)', font: { color: '#9CA3AF', size: 11 } },
        range: [-0.2, 1.0],
        gridcolor: 'rgba(255, 255, 255, 0.05)',
        zerolinecolor: 'rgba(255, 255, 255, 0.2)',
        tickfont: { color: '#9CA3AF', size: 10 },
      },
      yaxis: {
        title: { text: 'Samples grouped by cluster', font: { color: '#9CA3AF', size: 11 } },
        showticklabels: false,
        gridcolor: 'transparent',
      },
      shapes:
        overall_score !== null
          ? [
              {
                type: 'line',
                x0: overall_score,
                x1: overall_score,
                y0: 0,
                y1: 1,
                yref: 'paper',
                line: {
                  color: '#EF4444',
                  width: 2,
                  dash: 'dash',
                },
              },
            ]
          : [],
    };
  }, [overall_score, height]);

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Visual Verdict Banner */}
      <div className="flex flex-wrap items-center justify-between p-4 rounded-xl glass-panel border-l-4 border-l-cyan-500 bg-cyan-950/20">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">Clustering Verdict</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {verdict}
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">{explanation}</p>
        </div>

        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <div className="text-right">
            <div className="text-xs text-gray-400">Mean Silhouette Score</div>
            <div className="text-2xl font-black text-cyan-400 font-mono">
              {overall_score !== null ? overall_score.toFixed(3) : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Plotly Silhouette Canvas */}
      <div className="w-full rounded-xl overflow-hidden glass-panel p-2">
        <Plot
          data={plotTraces}
          layout={layout}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </div>

      {/* Per-Cluster Score Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(per_cluster_scores).map(([cId, score]) => (
          <div key={cId} className="p-3 rounded-xl glass-panel border border-gray-800 text-center">
            <div className="text-[11px] text-gray-400 font-medium">Cluster {parseInt(cId) + 1}</div>
            <div className="text-base font-bold text-gray-100 font-mono mt-0.5">{score.toFixed(3)}</div>
            <div className="text-[10px] text-gray-500">{cluster_sizes[cId]} samples</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SilhouettePlot;
