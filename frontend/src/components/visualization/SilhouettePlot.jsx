import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { PixelBadge } from '../common/PixelBadge';

const CLUSTER_COLORS = [
  '#00F0FF', // Electric Cyan
  '#FF2E93', // Neon Magenta
  '#39FF14', // Arcade Lime
  '#FFE600', // Warm Yellow
  '#9D00FF', // Arcade Violet
  '#FF7A00', // Arcade Orange
];

export const SilhouettePlot = ({ silhouetteData, height = 400 }) => {
  const hasData = Boolean(silhouetteData && silhouetteData.samples && silhouetteData.samples.length > 0);
  const overall_score = silhouetteData?.overall_score ?? null;
  const verdict = silhouetteData?.verdict || '';
  const explanation = silhouetteData?.explanation || '';

  const plotTraces = useMemo(() => {
    if (!silhouetteData || !silhouetteData.samples || silhouetteData.samples.length === 0) return [];
    const samples = silhouetteData.samples;
    const per_cluster_scores = silhouetteData.per_cluster_scores || {};
    const clusterMap = {};
    samples.forEach((s) => {
      if (!clusterMap[s.cluster_id]) clusterMap[s.cluster_id] = [];
      clusterMap[s.cluster_id].push(s.silhouette_value);
    });

    const traces = [];
    let currentY = 10;
    const gap = 15;

    Object.keys(clusterMap)
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
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
          name: `Cluster ${cId + 1} (Avg: ${per_cluster_scores[cIdStr] || 0})`,
          marker: {
            color,
            width: 1,
          },
          hoverinfo: 'x+name',
        });

        currentY += values.length + gap;
      });

    return traces;
  }, [silhouetteData]);

  const layout = useMemo(() => {
    return {
      title: {
        text: `Silhouette Profiles (Global Mean: ${overall_score !== null ? overall_score.toFixed(3) : 'N/A'})`,
        font: { color: '#F3F4F6', size: 13, family: 'Silkscreen, monospace' },
      },
      autosize: true,
      height,
      margin: { l: 60, r: 25, t: 40, b: 45 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: '#07040E',
      showlegend: true,
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1.02,
        xanchor: 'right',
        x: 1,
        font: { color: '#A09BAE', size: 10, family: 'Inter, sans-serif' },
      },
      xaxis: {
        title: { text: 'Silhouette Coefficient s(i)', font: { color: '#A09BAE', size: 11, family: 'Inter, sans-serif' } },
        range: [-0.2, 1.0],
        gridcolor: '#1B1133',
        zerolinecolor: '#FF2E93',
        tickfont: { color: '#8F89A0', size: 10 },
      },
      yaxis: {
        title: { text: 'Samples grouped by cluster', font: { color: '#A09BAE', size: 11, family: 'Inter, sans-serif' } },
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
                  color: '#FFE600',
                  width: 2.5,
                  dash: 'dash',
                },
              },
            ]
          : [],
    };
  }, [overall_score, height]);

  if (!hasData) {
    return (
      <div className="border border-[#231542] bg-[#0E091C] p-8 text-center text-gray-400 font-mono shadow-sm">
        <p className="text-[#00F0FF] text-sm">EVALUATION METRICS PENDING CALCULATION...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Plot Canvas */}
      <div className="border border-[#231542] bg-[#090514] p-3 shadow-sm">
        <Plot
          data={plotTraces}
          layout={layout}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </div>

      {/* Retro Verdict & Explanation Banner */}
      <div className="border border-[#00F0FF]/30 bg-[#0A1020] p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold text-[#00F0FF]">
              EVALUATION VERDICT:
            </span>
            <PixelBadge variant="cyan">{verdict || 'ANALYSIS COMPLETE'}</PixelBadge>
          </div>
          {explanation && (
            <p className="text-xs text-gray-300 mt-1.5 font-sans leading-relaxed">
              {explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SilhouettePlot;
