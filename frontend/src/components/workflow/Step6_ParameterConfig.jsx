import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { Settings2, Play, ArrowLeft, ArrowRight, AlertTriangle, Info, Sparkles } from 'lucide-react';

export const Step6_ParameterConfig = () => {
  const {
    selectedAlgorithm,
    kmeansParams,
    setKmeansParams,
    emParams,
    setEmParams,
    dbscanParams,
    setDbscanParams,
    executeAlgorithm,
    isRunningAlgorithm,
    nextStep,
    prevStep,
  } = useExperiment();

  const handleLaunch = async () => {
    await executeAlgorithm();
    nextStep();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Step 6: Hyperparameter Configuration</h1>
            <p className="text-xs text-gray-300">
              Tune algorithm parameters for <strong className="text-cyan-300 uppercase">{selectedAlgorithm}</strong> before launching the interactive simulation.
            </p>
          </div>
        </div>
      </div>

      {/* Algorithm-Specific Parameter Tuning Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
        {/* K-MEANS PARAMETERS */}
        {selectedAlgorithm === 'kmeans' && (
          <div className="space-y-6">
            {/* Cluster Count K */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Number of Clusters (K):</span>
                  <span className="font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-0.5 rounded border border-cyan-500/30 text-base">
                    {kmeansParams.k}
                  </span>
                </label>
                <span className="text-xs text-gray-400">Target cluster prototypes</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={kmeansParams.k}
                onChange={(e) => setKmeansParams({ ...kmeansParams, k: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                <span>K=1</span>
                <span>K=4</span>
                <span>K=8</span>
              </div>
            </div>

            {/* Initialization Method */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Centroid Initialization Strategy:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'k-means++',
                    name: 'K-Means++ (Probabilistic Distance)',
                    desc: 'Spreads initial centroids far apart, leading to faster and more reliable convergence.',
                  },
                  {
                    id: 'random',
                    name: 'Random Uniform Sampling',
                    desc: 'Picks K random points from the dataset as initial centroids (can get stuck in local minima).',
                  },
                ].map((init) => {
                  const isChecked = kmeansParams.init_method === init.id;
                  return (
                    <div
                      key={init.id}
                      onClick={() => setKmeansParams({ ...kmeansParams, init_method: init.id })}
                      className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                        isChecked
                          ? 'bg-indigo-950/50 border-indigo-500/80 ring-1 ring-indigo-500/30 text-white'
                          : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{init.name}</div>
                      <p className="text-[11px] text-gray-400 mt-1">{init.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Max Iterations */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-300 font-semibold">
                <span>Maximum Allowed Iterations:</span>
                <span className="font-mono text-indigo-400">{kmeansParams.max_iter}</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={kmeansParams.max_iter}
                onChange={(e) => setKmeansParams({ ...kmeansParams, max_iter: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* EM / GMM PARAMETERS */}
        {selectedAlgorithm === 'em' && (
          <div className="space-y-6">
            {/* Number of Components */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Number of Gaussian Components (K):</span>
                  <span className="font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-500/30 text-base">
                    {emParams.n_components}
                  </span>
                </label>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={emParams.n_components}
                onChange={(e) => setEmParams({ ...emParams, n_components: parseInt(e.target.value, 10) })}
                className="w-full accent-emerald-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Covariance Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Covariance Matrix Constraint:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'full', name: 'Full Covariance', desc: 'Each component has its own general symmetric covariance matrix (arbitrary orientation).' },
                  { id: 'diag', name: 'Diagonal Covariance', desc: 'Axis-aligned ellipsoidal clusters without rotation correlation.' },
                  { id: 'spherical', name: 'Spherical Covariance', desc: 'Single variance per component (spherical clusters like K-Means).' },
                ].map((cov) => {
                  const isChecked = emParams.covariance_type === cov.id;
                  return (
                    <div
                      key={cov.id}
                      onClick={() => setEmParams({ ...emParams, covariance_type: cov.id })}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        isChecked
                          ? 'bg-emerald-950/50 border-emerald-500/80 ring-1 ring-emerald-500/30 text-white'
                          : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{cov.name}</div>
                      <p className="text-[10px] text-gray-400 mt-1">{cov.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* DBSCAN PARAMETERS */}
        {selectedAlgorithm === 'dbscan' && (
          <div className="space-y-6">
            {/* Epsilon */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Epsilon Neighborhood Radius (ε):</span>
                  <span className="font-mono text-amber-400 bg-amber-950/50 px-2.5 py-0.5 rounded border border-amber-500/30 text-base">
                    {dbscanParams.eps.toFixed(2)}
                  </span>
                </label>
                <span className="text-xs text-gray-400">Search ball radius</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.50"
                step="0.02"
                value={dbscanParams.eps}
                onChange={(e) => setDbscanParams({ ...dbscanParams, eps: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                <span>0.05 (Tight)</span>
                <span>0.50 (Moderate)</span>
                <span>1.50 (Loose)</span>
              </div>
            </div>

            {/* MinPts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Minimum Samples Threshold (MinPts):</span>
                  <span className="font-mono text-amber-400 bg-amber-950/50 px-2.5 py-0.5 rounded border border-amber-500/30 text-base">
                    {dbscanParams.min_samples}
                  </span>
                </label>
                <span className="text-xs text-gray-400">Core point threshold</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={dbscanParams.min_samples}
                onChange={(e) => setDbscanParams({ ...dbscanParams, min_samples: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation & Launch */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Algorithm</span>
        </button>

        <button
          onClick={handleLaunch}
          disabled={isRunningAlgorithm}
          className="flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-xl shadow-cyan-500/25 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isRunningAlgorithm ? 'Computing Simulation...' : 'Launch Simulation Playback'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step6_ParameterConfig;
