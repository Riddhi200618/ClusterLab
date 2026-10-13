import React, { useMemo } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PlotlyWrapper } from '../visualization/PlotlyWrapper';
import { TableProperties, ArrowRight, ArrowLeft, BarChart2, Eye } from 'lucide-react';

export const Step3_DatasetPreview = () => {
  const { datasetDetails, nextStep, prevStep } = useExperiment();

  const points2D = useMemo(() => {
    if (!datasetDetails || !datasetDetails.data || datasetDetails.data.length === 0) return [];
    const f1 = datasetDetails.default_features[0] || datasetDetails.feature_names[0];
    const f2 = datasetDetails.default_features[1] || datasetDetails.feature_names[1];
    return datasetDetails.data.map((row) => [row[f1], row[f2]]);
  }, [datasetDetails]);

  if (!datasetDetails) {
    return (
      <div className="glass-panel p-8 text-center text-gray-400 rounded-xl">
        <p>Loading dataset details...</p>
      </div>
    );
  }

  const { name, description, sample_count, feature_count, feature_names, default_features, data, statistics } = datasetDetails;

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <TableProperties className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Step 3: Dataset Preview & Statistical Distribution</h1>
            <p className="text-xs text-gray-300">Inspect sample distributions, feature ranges, and raw unclustered spatial scatter.</p>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl glass-panel border border-gray-800">
          <span className="text-[11px] text-gray-400 font-medium">Dataset Name</span>
          <div className="text-sm font-bold text-white mt-1 truncate">{name}</div>
        </div>
        <div className="p-4 rounded-xl glass-panel border border-gray-800">
          <span className="text-[11px] text-gray-400 font-medium">Total Samples (N)</span>
          <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">{sample_count}</div>
        </div>
        <div className="p-4 rounded-xl glass-panel border border-gray-800">
          <span className="text-[11px] text-gray-400 font-medium">Total Features (D)</span>
          <div className="text-lg font-bold text-indigo-400 font-mono mt-0.5">{feature_count}</div>
        </div>
        <div className="p-4 rounded-xl glass-panel border border-gray-800">
          <span className="text-[11px] text-gray-400 font-medium">Default 2D View</span>
          <div className="text-xs font-mono text-emerald-400 mt-1 truncate">{default_features.join(' vs ')}</div>
        </div>
      </div>

      {/* Main Grid: Data Table & Raw Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw Data Table */}
        <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Feature Statistics (Mean, Std, Range)</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-gray-400 uppercase bg-gray-900/60 font-mono">
                  <tr>
                    <th className="px-3 py-2">Feature</th>
                    <th className="px-3 py-2">Mean</th>
                    <th className="px-3 py-2">Std Dev</th>
                    <th className="px-3 py-2">Min - Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono">
                  {statistics.map((stat) => (
                    <tr key={stat.feature_name} className="hover:bg-gray-800/30">
                      <td className="px-3 py-2 font-sans font-semibold text-gray-200">{stat.feature_name}</td>
                      <td className="px-3 py-2 text-cyan-300">{stat.mean.toFixed(2)}</td>
                      <td className="px-3 py-2 text-gray-400">{stat.std.toFixed(2)}</td>
                      <td className="px-3 py-2 text-gray-300">[{stat.min.toFixed(1)}, {stat.max.toFixed(1)}]</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sample Records Snippet */}
            <div className="mt-4 pt-3 border-t border-gray-800">
              <div className="text-[11px] text-gray-400 font-semibold mb-2">First 5 Sample Records:</div>
              <div className="overflow-x-auto rounded-lg bg-black/40 border border-gray-800/80 p-2 font-mono text-[11px]">
                <table className="w-full">
                  <thead className="text-gray-500">
                    <tr>
                      <th className="px-2 py-1">#</th>
                      {feature_names.map((f) => (
                        <th key={f} className="px-2 py-1">{f}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50 text-gray-300">
                    {data.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1 text-gray-500">{idx + 1}</td>
                        {feature_names.map((f) => (
                          <td key={f} className="px-2 py-1">{row[f]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Raw 2D Scatter Plot */}
        <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-col">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-800 mb-2">
            <Eye className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Unclustered Raw Spatial Scatter Preview
            </h3>
          </div>

          <div className="h-[360px] w-full">
            <PlotlyWrapper
              points={points2D}
              labels={new Array(points2D.length).fill(0)}
              featureNames={default_features}
              title={`Raw 2D Distribution: ${default_features[0]} vs ${default_features[1]}`}
              height={350}
            />
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Selection</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <span>Feature Selection & Scaling</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step3_DatasetPreview;
