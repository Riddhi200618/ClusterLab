import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';

const CLUSTER_COLORS = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EF4444', // Red
  '#14B8A6', // Teal
];

export const PlotlyWrapper = ({
  points = [],
  labels = [],
  centroids = [],
  previousCentroids = [],
  ellipses = [],
  activePoint = null,
  activeRadius = null,
  featureNames = ['Feature 1', 'Feature 2'],
  title = '',
  height = 500,
  show3D = false,
}) => {
  const plotData = useMemo(() => {
    if (!points || points.length === 0) return [];

    const traces = [];
    const nSamples = points.length;
    const safeLabels = labels && labels.length === nSamples ? labels : new Array(nSamples).fill(0);

    // Group points by cluster label
    const clusterMap = {};
    safeLabels.forEach((lbl, idx) => {
      if (!clusterMap[lbl]) clusterMap[lbl] = [];
      clusterMap[lbl].push(idx);
    });

    const is3D = show3D && points[0] && points[0].length >= 3;

    // 1. Data point traces per cluster
    Object.keys(clusterMap).forEach((lblStr) => {
      const lbl = parseInt(lblStr, 10);
      const indices = clusterMap[lbl];
      const isNoise = lbl === -1;

      const x = indices.map((i) => points[i][0]);
      const y = indices.map((i) => points[i][1]);
      const z = is3D ? indices.map((i) => points[i][2]) : undefined;

      const color = isNoise ? '#6B7280' : CLUSTER_COLORS[Math.abs(lbl) % CLUSTER_COLORS.length];
      const name = isNoise ? 'Noise / Outlier' : `Cluster ${lbl + 1}`;

      traces.push({
        x,
        y,
        ...(is3D ? { z } : {}),
        type: is3D ? 'scatter3d' : 'scattergl',
        mode: 'markers',
        name,
        marker: {
          color,
          size: isNoise ? 6 : 8,
          symbol: isNoise ? 'x' : 'circle',
          opacity: isNoise ? 0.6 : 0.85,
          line: {
            color: isNoise ? '#374151' : '#FFFFFF',
            width: isNoise ? 1 : 1,
          },
        },
        hoverinfo: 'text',
        text: indices.map(
          (i) => `Sample #${i}<br>${featureNames[0]}: ${points[i][0].toFixed(2)}<br>${featureNames[1]}: ${points[i][1].toFixed(2)}<br>Cluster: ${isNoise ? 'Noise' : lbl + 1}`
        ),
      });
    });

    // 2. Active Query Point & Epsilon Circle (for DBSCAN)
    if (activePoint && !is3D) {
      traces.push({
        x: [activePoint[0]],
        y: [activePoint[1]],
        type: 'scatter',
        mode: 'markers',
        name: 'Inspecting Point',
        marker: {
          color: '#F43F5E',
          size: 14,
          symbol: 'cross',
          line: { color: '#FFFFFF', width: 2 },
        },
        hoverinfo: 'name',
      });
    }

    // 3. Centroids trace (for K-Means)
    if (centroids && centroids.length > 0) {
      const cx = centroids.map((c) => c[0]);
      const cy = centroids.map((c) => c[1]);
      const cz = is3D ? centroids.map((c) => c[2] || 0) : undefined;

      traces.push({
        x: cx,
        y: cy,
        ...(is3D ? { z: cz } : {}),
        type: is3D ? 'scatter3d' : 'scatter',
        mode: 'markers',
        name: 'Centroids (Current)',
        marker: {
          color: '#FFFFFF',
          size: is3D ? 10 : 16,
          symbol: 'diamond',
          line: {
            color: '#000000',
            width: 2,
          },
        },
        hoverinfo: 'text',
        text: centroids.map((c, idx) => `Centroid #${idx + 1}<br>(${c[0].toFixed(2)}, ${c[1].toFixed(2)})`),
      });

      // Centroid shift path from previous step
      if (previousCentroids && previousCentroids.length === centroids.length && !is3D) {
        for (let k = 0; k < centroids.length; k++) {
          traces.push({
            x: [previousCentroids[k][0], centroids[k][0]],
            y: [previousCentroids[k][1], centroids[k][1]],
            type: 'scatter',
            mode: 'lines',
            showlegend: k === 0,
            name: 'Centroid Shift Path',
            line: {
              color: '#F59E0B',
              width: 2,
              dash: 'dot',
            },
            hoverinfo: 'none',
          });
        }
      }
    }

    // 4. Gaussian Confidence Ellipses (for EM / GMM)
    if (ellipses && ellipses.length > 0 && !is3D) {
      ellipses.forEach((ell, idx) => {
        const color = CLUSTER_COLORS[idx % CLUSTER_COLORS.length];
        const numPoints = 60;
        const theta = (ell.angle_deg * Math.PI) / 180;

        // Generate parametric ellipse coordinates for 1-sigma and 2-sigma
        [
          { rx: ell.sigma_1_rx, ry: ell.sigma_1_ry, dash: 'solid', name: `GMM #${idx + 1} (1σ 68%)` },
          { rx: ell.sigma_2_rx, ry: ell.sigma_2_ry, dash: 'dash', name: `GMM #${idx + 1} (2σ 95%)` },
        ].forEach((sigmaObj, sIdx) => {
          const ex = [];
          const ey = [];
          for (let i = 0; i <= numPoints; i++) {
            const angle = (i * 2 * Math.PI) / numPoints;
            const px = sigmaObj.rx * Math.cos(angle);
            const py = sigmaObj.ry * Math.sin(angle);
            // Rotate and translate
            const rx = ell.mean[0] + px * Math.cos(theta) - py * Math.sin(theta);
            const ry = ell.mean[1] + px * Math.sin(theta) + py * Math.cos(theta);
            ex.push(rx);
            ey.push(ry);
          }

          traces.push({
            x: ex,
            y: ey,
            type: 'scatter',
            mode: 'lines',
            name: sigmaObj.name,
            showlegend: sIdx === 0,
            line: {
              color,
              width: sIdx === 0 ? 2 : 1.5,
              dash: sigmaObj.dash,
            },
            hoverinfo: 'name',
          });
        });
      });
    }

    return traces;
  }, [points, labels, centroids, previousCentroids, ellipses, activePoint, featureNames, show3D]);

  // Layout configuration
  const layout = useMemo(() => {
    const is3D = show3D && points[0] && points[0].length >= 3;

    return {
      title: title ? { text: title, font: { color: '#F3F4F6', size: 14 } } : undefined,
      autosize: true,
      height,
      margin: { l: 45, r: 25, t: title ? 35 : 20, b: 45 },
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
        title: { text: featureNames[0] || 'Feature 1', font: { color: '#9CA3AF', size: 11 } },
        gridcolor: 'rgba(255, 255, 255, 0.05)',
        zerolinecolor: 'rgba(255, 255, 255, 0.1)',
        tickfont: { color: '#9CA3AF', size: 10 },
      },
      yaxis: {
        title: { text: featureNames[1] || 'Feature 2', font: { color: '#9CA3AF', size: 11 } },
        gridcolor: 'rgba(255, 255, 255, 0.05)',
        zerolinecolor: 'rgba(255, 255, 255, 0.1)',
        tickfont: { color: '#9CA3AF', size: 10 },
      },
      ...(is3D
        ? {
            scene: {
              xaxis: { title: featureNames[0], gridcolor: '#374151', color: '#9CA3AF' },
              yaxis: { title: featureNames[1], gridcolor: '#374151', color: '#9CA3AF' },
              zaxis: { title: featureNames[2] || 'Feature 3', gridcolor: '#374151', color: '#9CA3AF' },
              bgcolor: 'rgba(15, 23, 42, 0.5)',
            },
          }
        : {}),
    };
  }, [title, height, featureNames, show3D, points]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden glass-panel p-2">
      <Plot
        data={plotData}
        layout={layout}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d'],
        }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default PlotlyWrapper;
