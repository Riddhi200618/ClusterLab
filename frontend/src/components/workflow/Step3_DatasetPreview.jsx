import React, { useMemo } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PlotlyWrapper } from '../visualization/PlotlyWrapper';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
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
      <div className="border border-[#231542] bg-[#0E091C] p-8 text-center text-gray-400 font-mono shadow-sm">
        <p className="text-sm text-[#00F0FF]">LOADING DATASET PREVIEW...</p>
      </div>
    );
  }

  const { name, sample_count, feature_count, feature_names, default_features, data, statistics } = datasetDetails;

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border border-[#231542] bg-[#0E091C] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-[#00F0FF]/40 bg-[#0B1226] flex items-center justify-center text-cyan-300 shadow-sm">
              <TableProperties className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-['Press_Start_2P'] text-[10px] text-[#00F0FF]">STAGE 2</span>
                <h1 className="font-['Silkscreen'] text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Dataset Preview & Statistics
                </h1>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 font-sans">
                Inspect sample counts, summary statistics, and raw coordinate distributions for the loaded dataset.
              </p>
            </div>
          </div>

          <PixelBadge variant="cyan">
            STATISTICS
          </PixelBadge>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400">DATASET:</span>
          <div className="font-mono text-xs font-bold text-white mt-1 truncate">{name}</div>
        </div>
        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400">SAMPLES (N):</span>
          <div className="font-mono text-base font-bold text-[#00F0FF] mt-0.5">{sample_count}</div>
        </div>
        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400">FEATURES (D):</span>
          <div className="font-mono text-base font-bold text-[#FF2E93] mt-0.5">{feature_count}</div>
        </div>
        <div className="p-3 border border-[#20133A] bg-[#0E091C] shadow-sm">
          <span className="font-['Silkscreen'] text-[10px] text-gray-400">DEFAULT VIEW:</span>
          <div className="font-mono text-xs text-[#39FF14] mt-1 truncate">{default_features.join(' vs ')}</div>
        </div>
      </div>

      {/* Main Grid: Data Table & Raw Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw Data Table */}
        <div className="border border-[#20133A] bg-[#0E091C] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1E1136] mb-3">
              <h3 className="font-['Silkscreen'] text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-[#00F0FF]" />
                <span>Feature Statistics (Moments & Bounds)</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-gray-400 uppercase bg-[#090514] border-b border-[#20133A]">
                  <tr>
                    <th className="px-3 py-2">Feature</th>
                    <th className="px-3 py-2">Mean</th>
                    <th className="px-3 py-2">Std Dev</th>
                    <th className="px-3 py-2">Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D1036]">
                  {statistics.map((stat) => (
                    <tr key={stat.feature_name} className="hover:bg-[#1A1035]">
                      <td className="px-3 py-2 font-semibold text-gray-200">{stat.feature_name}</td>
                      <td className="px-3 py-2 text-[#00F0FF]">{stat.mean.toFixed(2)}</td>
                      <td className="px-3 py-2 text-gray-400">{stat.std.toFixed(2)}</td>
                      <td className="px-3 py-2 text-gray-300">[{stat.min.toFixed(1)}, {stat.max.toFixed(1)}]</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sample Records Snippet */}
            <div className="mt-4 pt-3 border-t border-[#1E1136]">
              <div className="font-['Silkscreen'] text-[10px] text-gray-400 uppercase font-bold mb-2">
                First 5 Sample Records:
              </div>
              <div className="overflow-x-auto border border-[#1E1136] bg-[#07040E] p-2 font-mono text-[11px]">
                <table className="w-full">
                  <thead className="text-gray-500 border-b border-[#1E1136]">
                    <tr>
                      <th className="px-2 py-1 text-left">#</th>
                      {feature_names.map((f) => (
                        <th key={f} className="px-2 py-1 text-left">{f}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#180E2B] text-gray-300">
                    {data.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#130B24]">
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
        <div className="border border-[#20133A] bg-[#0E091C] p-4 shadow-sm flex flex-col">
          <div className="flex items-center space-x-2 pb-2.5 border-b border-[#1E1136] mb-3">
            <Eye className="w-4 h-4 text-[#00F0FF]" />
            <h3 className="font-['Silkscreen'] text-xs font-bold text-white uppercase tracking-wider">
              Unclustered Raw Spatial Scatter
            </h3>
          </div>

          <div className="h-[360px] w-full border border-[#1E1136] bg-[#07040E]">
            <PlotlyWrapper
              points={points2D}
              labels={new Array(points2D.length).fill(0)}
              featureNames={default_features}
              title={`Raw Topography: ${default_features[0]} vs ${default_features[1]}`}
              height={350}
            />
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E1136]">
        <PixelButton
          variant="dark"
          size="md"
          onClick={prevStep}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          PREV [DATASET]
        </PixelButton>

        <PixelButton
          variant="cyan"
          size="md"
          onClick={nextStep}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          NEXT: FEATURES & SCALING
        </PixelButton>
      </div>
    </div>
  );
};

export default Step3_DatasetPreview;
