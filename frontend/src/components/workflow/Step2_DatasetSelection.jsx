import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { FolderOpen, ArrowRight, ArrowLeft, Sliders, Database, Sparkles, RefreshCw } from 'lucide-react';

const DATASET_CARDS = [
  {
    slug: 'iris',
    name: 'Iris Flower Dataset',
    category: 'Real-World',
    samples: 150,
    features: 4,
    badge: 'Benchmark',
    desc: 'Botanical benchmark with 3 species (Setosa, Versicolor, Virginica) across 4 morphological measurements.',
    suitableFor: 'K-Means, EM, DBSCAN',
  },
  {
    slug: 'mall_customers',
    name: 'Mall Customers',
    category: 'Real-World',
    samples: 200,
    features: 2,
    badge: 'Marketing',
    desc: 'Customer segmentation with Annual Income ($k) and Spending Score (1-100) forming 5 distinct clusters.',
    suitableFor: 'K-Means, EM',
  },
  {
    slug: 'wine',
    name: 'Wine Recognition',
    category: 'Real-World',
    samples: 178,
    features: 13,
    badge: 'High-Dimensional',
    desc: 'Chemical constituent analysis of 3 Italian wine cultivars with 13 continuous features.',
    suitableFor: 'PCA + K-Means',
  },
  {
    slug: 'synthetic_blobs',
    name: 'Synthetic Gaussian Blobs',
    category: 'Synthetic',
    samples: 300,
    features: 2,
    badge: 'Spherical',
    desc: 'Isotropic Gaussian point distributions designed to validate spherical centroid clustering assumptions.',
    suitableFor: 'K-Means & EM Baseline',
  },
  {
    slug: 'synthetic_moons',
    name: 'Synthetic Two Moons',
    category: 'Synthetic',
    samples: 300,
    features: 2,
    badge: 'Non-Convex',
    desc: 'Two interlocking crescent arcs demonstrating failure of distance centroids and superiority of DBSCAN.',
    suitableFor: 'DBSCAN Showcase',
  },
  {
    slug: 'synthetic_circles',
    name: 'Synthetic Concentric Rings',
    category: 'Synthetic',
    samples: 300,
    features: 2,
    badge: 'Manifold',
    desc: 'Concentric ring manifolds challenging standard Euclidean distance clustering.',
    suitableFor: 'DBSCAN & Kernel Methods',
  },
];

export const Step2_DatasetSelection = () => {
  const {
    selectedDatasetSlug,
    loadDatasetDetails,
    syntheticParams,
    setSyntheticParams,
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
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Step 2: Dataset Selection & Synthesis</h1>
            <p className="text-xs text-gray-300">Choose a real-world scientific dataset or generate custom synthetic cluster geometries.</p>
          </div>
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
              className={`p-5 rounded-2xl cursor-pointer transition-all relative glass-panel flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-400/80 bg-indigo-950/40 ring-2 ring-cyan-400/30 shadow-xl shadow-cyan-500/10'
                  : 'border-gray-800/80 hover:border-gray-700 hover:bg-gray-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    ds.category === 'Real-World'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {ds.badge}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{ds.samples} samples</span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight mt-1">{ds.name}</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{ds.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">Dimensions: <strong className="text-gray-300">{ds.features}D</strong></span>
                <span className="text-cyan-400 font-semibold">{isSelected ? 'Active Selection' : 'Select'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthetic Parameter Controls (Only visible when synthetic dataset is selected) */}
      {isSynthetic && (
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20 bg-emerald-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sliders className="w-4 h-4" />
              <span>Synthetic Generator Parameters</span>
            </div>

            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/30 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate Random Points</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Sample Count: <strong className="text-white">{localSyntheticParams.n_samples}</strong>
              </label>
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
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Noise / Dispersion: <strong className="text-white">{localSyntheticParams.noise.toFixed(2)}</strong>
              </label>
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
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {selectedDatasetSlug === 'synthetic_blobs' && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Cluster Centers (K): <strong className="text-white">{localSyntheticParams.centers}</strong>
                </label>
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
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Theory</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <span>Preview Dataset</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step2_DatasetSelection;
