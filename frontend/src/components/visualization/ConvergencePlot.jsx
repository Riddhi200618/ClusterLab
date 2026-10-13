import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';

export const ConvergencePlot = ({ steps = [], algorithmType = 'kmeans', height = 240 }) => {
  const { xData, yData, title, yTitle, color } = useMemo(() => {
    if (!steps || steps.length === 0) return { xData: [], yData: [], title: '', yTitle: '', color: '#6366F1' };

    const iterSteps = steps.filter((s) => s.iteration !== undefined);
    const iters = [];
    const values = [];

    iterSteps.forEach((s) => {
      if (algorithmType === 'kmeans' && s.wcss !== undefined) {
        iters.push(s.iteration);
        values.push(s.wcss);
      } else if (algorithmType === 'em' && s.log_likelihood !== undefined) {
        iters.push(s.iteration);
        values.push(s.log_likelihood);
      }
    });

    const isKMeans = algorithmType === 'kmeans';
    return {
      xData: iters,
      yData: values,
      title: isKMeans ? 'Objective Loss: WCSS Convergence' : 'Optimization: Log-Likelihood Trajectory',
      yTitle: isKMeans ? 'Within-Cluster Sum of Squares' : 'Log-Likelihood ln p(X)',
      color: isKMeans ? '#06B6D4' : '#10B981',
    };
  }, [steps, algorithmType]);

  if (xData.length === 0) return null;

  return (
    <div className="w-full rounded-xl overflow-hidden glass-panel p-2">
      <Plot
        data={[
          {
            x: xData,
            y: yData,
            type: 'scatter',
            mode: 'lines+markers',
            name: yTitle,
            line: { color, width: 2.5 },
            marker: { size: 6, color },
            hoverinfo: 'x+y',
          },
        ]}
        layout={{
          title: { text: title, font: { color: '#F3F4F6', size: 12 } },
          autosize: true,
          height,
          margin: { l: 50, r: 20, t: 30, b: 35 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(15, 23, 42, 0.5)',
          xaxis: {
            title: { text: 'Iteration Index', font: { color: '#9CA3AF', size: 10 } },
            gridcolor: 'rgba(255, 255, 255, 0.05)',
            tickfont: { color: '#9CA3AF', size: 9 },
          },
          yaxis: {
            title: { text: yTitle, font: { color: '#9CA3AF', size: 10 } },
            gridcolor: 'rgba(255, 255, 255, 0.05)',
            tickfont: { color: '#9CA3AF', size: 9 },
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default ConvergencePlot;
