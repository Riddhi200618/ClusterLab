import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { ArrowRight, ArrowLeft, Sliders, Database, RefreshCw } from 'lucide-react';

const DATASET_CARDS = [
  {
    slug: 'iris',
    name: 'Iris Flower Dataset',
    category: 'Real-World',
    samples: 150,
    features: 4,
    badge: 'Benchmark',
    badgeColor: 'cyan',
    desc: 'Flower measurements from three Iris species.',
    suitableFor: 'K-Means, EM, DBSCAN',
  },
  {
    slug: 'mall_customers',
    name: 'Mall Customers',
    category: 'Real-World',
    samples: 200,
    features: 2,
    badge: 'Marketing',
    badgeColor: 'purple',
    desc: 'Customer income and spending scores.',
    suitableFor: 'K-Means, EM',
  },
  {
    slug: 'wine',
    name: 'Wine Recognition',
    category: 'Real-World',
    samples: 178,
    features: 13,
    badge: 'High-Dim',
    badgeColor: 'yellow',
    desc: '13 chemical measurements from three types of wine.',
    suitableFor: 'K-Means, EM',
  },
  {
    slug: 'synthetic_blobs',
    name: 'Synthetic Gaussian Blobs',
    category: 'Synthetic',
    samples: 300,
    features: 2,
    badge: 'Spherical',
    badgeColor: 'lime',
    desc: 'Generated points in round groups.',
    suitableFor: 'K-Means & EM Baseline',
  },
  {
    slug: 'synthetic_moons',
    name: 'Synthetic Two Moons',
    category: 'Synthetic',
    samples: 300,
    features: 2,
    badge: 'Non-Convex',
    badgeColor: 'pink',
    desc: 'Generated points in two curved groups.',
    suitableFor: 'DBSCAN Showcase',
  },
  {
    slug: 'synthetic_circles',
    name: 'Synthetic Concentric Rings',
    category: 'Synthetic',
    samples: 300,
    features: 2,
    badge: 'Manifold',
    badgeColor: 'cyan',
    desc: 'Generated points in inner and outer rings.',
    suitableFor: 'DBSCAN',
  },
];

export const Step2_DatasetSelection = () => {
  const {
    selectedDatasetSlug,
    loadDatasetDetails,
    syntheticParams,
    generateSynthetic,
    nextStep,
    prevStep,
    loading
  } = useExperiment();

  const [localSyntheticParams, setLocalSyntheticParams] = useState({ ...syntheticParams });
  const isSynthetic = selectedDatasetSlug.startsWith('synthetic_');

  const handleSelect = (slug) => {
    if (slug.startsWith('synthetic_')) {
      const type = slug.replace('synthetic_', '');
      const updated = { ...localSyntheticParams, dataset_type: type };
      setLocalSyntheticParams(updated);
      generateSynthetic(updated);
    } else {
      loadDatasetDetails(slug);
    }
  };

  const handleRegenerate = () => {
    const type = selectedDatasetSlug.replace('synthetic_', '');
    const updated = {
      ...localSyntheticParams,
      dataset_type: type,
      random_state: Math.floor(Math.random() * 10000),
    };
    setLocalSyntheticParams(updated);
    generateSynthetic(updated);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border border-[#231542] bg-[#0E091C] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-[#00F0FF]/40 bg-[#0B1226] flex items-center justify-center text-cyan-300 shadow-sm">
              <Database className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-sans text-[10px] text-[#00F0FF]">STAGE 2</span>
                <h1 className="font-sans text-base sm:text-lg font-bold text-white normal-case tracking-normal">
                  Dataset Selection
                </h1>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 font-sans">
                Choose a dataset or generate sample data.
              </p>
            </div>
          </div>

          <PixelBadge variant="cyan">
            DATA PREPARATION
          </PixelBadge>
        </div>
      </div>

      {/* Dataset Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DATASET_CARDS.map((ds) => {
          const isSelected = selectedDatasetSlug === ds.slug;
          return (
            <div
              key={ds.slug}
              onClick={() => handleSelect(ds.slug)}
              className={`p-4 border transition-all cursor-pointer flex flex-col justify-between relative shadow-sm ${
                isSelected
                  ? 'border-[#00F0FF] bg-[#0C152B]'
                  : 'border-[#20133A] bg-[#0E091C] hover:border-[#3A2269] hover:bg-[#120D24]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <PixelBadge variant={ds.badgeColor}>
                    {ds.badge}
                  </PixelBadge>
                  <span className="font-sans text-[10px] text-gray-400">
                    {ds.samples} PTS
                  </span>
                </div>

                <h3 className="font-sans text-xs sm:text-sm font-bold text-white mt-1">
                  {ds.name}
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed font-sans">
                  {ds.desc}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#1E1136] flex items-center justify-between text-xs font-sans">
                <span className="text-gray-400">
                  DIM: <strong className="text-cyan-300">{ds.features}D</strong>
                </span>
                <span className={`font-sans text-[10px] normal-case font-semibold ${
                  isSelected ? 'text-[#00F0FF]' : 'text-gray-500'
                }`}>
                  {isSelected ? '✓ SELECTED' : 'SELECT'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthetic Parameter Controls (Only visible when synthetic dataset is selected) */}
      {isSynthetic && (
        <div className="border border-emerald-500/40 bg-[#09150E] p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-900/40 pb-2.5">
            <div className="flex items-center space-x-2 text-[#39FF14] font-sans text-xs font-bold normal-case tracking-normal">
              <Sliders className="w-4 h-4 text-[#39FF14]" />
              <span>Synthetic Dataset Parameters</span>
            </div>

            <PixelButton
              variant="lime"
              size="sm"
              onClick={handleRegenerate}
              disabled={loading}
              icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              REGENERATE
            </PixelButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-sans text-gray-300">
                <span>SAMPLE COUNT:</span>
                <span className="text-[#39FF14] font-bold">{localSyntheticParams.n_samples}</span>
              </div>
              <input
                type="range"
                min="100"
                max="800"
                step="50"
                value={localSyntheticParams.n_samples}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  const updated = { ...localSyntheticParams, n_samples: val };
                  setLocalSyntheticParams(updated);
                  generateSynthetic(updated);
                }}
                className="w-full accent-[#39FF14] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-sans text-gray-300">
                <span>DISPERSION / NOISE:</span>
                <span className="text-[#39FF14] font-bold">{localSyntheticParams.noise.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.30"
                step="0.01"
                value={localSyntheticParams.noise}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const updated = { ...localSyntheticParams, noise: val };
                  setLocalSyntheticParams(updated);
                  generateSynthetic(updated);
                }}
                className="w-full accent-[#39FF14] cursor-pointer"
              />
            </div>

            {selectedDatasetSlug === 'synthetic_blobs' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-sans text-gray-300">
                  <span>CENTERS (K):</span>
                  <span className="text-[#39FF14] font-bold">{localSyntheticParams.centers}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={localSyntheticParams.centers}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    const updated = { ...localSyntheticParams, centers: val };
                    setLocalSyntheticParams(updated);
                    generateSynthetic(updated);
                  }}
                  className="w-full accent-[#39FF14] cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E1136]">
        <PixelButton
          variant="dark"
          size="md"
          onClick={prevStep}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          PREV [STAGE 1]
        </PixelButton>

        <PixelButton
          variant="cyan"
          size="md"
          onClick={nextStep}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          NEXT: DATASET PREVIEW
        </PixelButton>
      </div>
    </div>
  );
};

export default Step2_DatasetSelection;
