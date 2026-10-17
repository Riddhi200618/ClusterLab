import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { Settings2, Play, ArrowLeft } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border border-[#231542] bg-[#0E091C] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-[#00F0FF]/40 bg-[#0B1226] flex items-center justify-center text-cyan-300 shadow-sm">
              <Settings2 className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-['Press_Start_2P'] text-[10px] text-[#00F0FF]">STAGE 3</span>
                <h1 className="font-['Silkscreen'] text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Parameter Configuration
                </h1>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 font-sans">
                Configure hyperparameters and convergence tolerances for <strong className="text-[#00F0FF] uppercase">{selectedAlgorithm}</strong>.
              </p>
            </div>
          </div>

          <PixelBadge variant="cyan">
            HYPERPARAMETERS
          </PixelBadge>
        </div>
      </div>

      {/* Algorithm-Specific Parameter Tuning Panel */}
      <div className="border border-[#20133A] bg-[#0E091C] p-5 sm:p-6 shadow-sm space-y-6">
        {/* K-MEANS PARAMETERS */}
        {selectedAlgorithm === 'kmeans' && (
          <div className="space-y-6">
            {/* Cluster Count K */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-['Silkscreen'] font-bold text-white flex items-center space-x-2">
                  <span>TARGET CLUSTER COUNT (K):</span>
                  <span className="font-mono text-xs text-[#00F0FF] bg-[#0C152B] px-2 py-0.5 border border-[#00F0FF]/40 font-bold">
                    {kmeansParams.k}
                  </span>
                </label>
                <span className="text-[11px] text-gray-400 font-mono">1 to 8 Prototypes</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={kmeansParams.k}
                onChange={(e) => setKmeansParams({ ...kmeansParams, k: parseInt(e.target.value, 10) })}
                className="w-full accent-[#00F0FF] h-2 bg-[#090514] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>K=1</span>
                <span>K=4</span>
                <span>K=8</span>
              </div>
            </div>

            {/* Initialization Method */}
            <div className="space-y-2">
              <label className="text-xs font-['Silkscreen'] font-bold text-gray-300 uppercase tracking-wider block">
                Centroid Initialization Strategy:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'k-means++',
                    name: 'K-Means++ (Distance Distribution)',
                    desc: 'Spreads initial centroids far apart, ensuring faster and more stable convergence.',
                  },
                  {
                    id: 'random',
                    name: 'Random Uniform Sampling',
                    desc: 'Picks K random points from the dataset as initial centroids (local minima risk).',
                  },
                ].map((init) => {
                  const isChecked = kmeansParams.init_method === init.id;
                  return (
                    <div
                      key={init.id}
                      onClick={() => setKmeansParams({ ...kmeansParams, init_method: init.id })}
                      className={`p-3 border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#00F0FF] bg-[#0C152B] text-white shadow-sm'
                          : 'border-[#20133A] bg-[#0A0617] text-gray-400 hover:border-[#3A2269]'
                      }`}
                    >
                      <div className="font-['Silkscreen'] text-xs font-bold text-white">{init.name}</div>
                      <p className="text-[11px] text-gray-400 mt-1 font-sans">{init.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Max Iterations */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-gray-300 font-semibold">
                <span>MAX ALLOWED ITERATIONS:</span>
                <span className="text-[#00F0FF] font-bold">{kmeansParams.max_iter}</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={kmeansParams.max_iter}
                onChange={(e) => setKmeansParams({ ...kmeansParams, max_iter: parseInt(e.target.value, 10) })}
                className="w-full accent-[#00F0FF] h-2 bg-[#090514] cursor-pointer"
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
                <label className="text-xs font-['Silkscreen'] font-bold text-white flex items-center space-x-2">
                  <span>GAUSSIAN COMPONENTS (K):</span>
                  <span className="font-mono text-xs text-[#39FF14] bg-[#08150D] px-2 py-0.5 border border-[#39FF14]/40 font-bold">
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
                className="w-full accent-[#39FF14] h-2 bg-[#090514] cursor-pointer"
              />
            </div>

            {/* Covariance Type */}
            <div className="space-y-2">
              <label className="text-xs font-['Silkscreen'] font-bold text-gray-300 uppercase tracking-wider block">
                Covariance Matrix Structure:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'full', name: 'Full Covariance', desc: 'Each component has an independent general covariance matrix with arbitrary rotation.' },
                  { id: 'diag', name: 'Diagonal Covariance', desc: 'Axis-aligned ellipsoidal clusters without rotation correlation.' },
                  { id: 'spherical', name: 'Spherical Covariance', desc: 'Single variance per component (spherical clusters like K-Means).' },
                ].map((cov) => {
                  const isChecked = emParams.covariance_type === cov.id;
                  return (
                    <div
                      key={cov.id}
                      onClick={() => setEmParams({ ...emParams, covariance_type: cov.id })}
                      className={`p-3 border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#39FF14] bg-[#08150D] text-white shadow-sm'
                          : 'border-[#20133A] bg-[#0A0617] text-gray-400 hover:border-[#3A2269]'
                      }`}
                    >
                      <div className="font-['Silkscreen'] text-xs font-bold text-white">{cov.name}</div>
                      <p className="text-[10px] text-gray-400 mt-1 font-sans">{cov.desc}</p>
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
                <label className="text-xs font-['Silkscreen'] font-bold text-white flex items-center space-x-2">
                  <span>EPSILON RADIUS (ε):</span>
                  <span className="font-mono text-xs text-[#FF2E93] bg-[#160819] px-2 py-0.5 border border-[#FF2E93]/40 font-bold">
                    {dbscanParams.eps.toFixed(2)}
                  </span>
                </label>
                <span className="text-[11px] text-gray-400 font-mono">Neighborhood Radius</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.50"
                step="0.02"
                value={dbscanParams.eps}
                onChange={(e) => setDbscanParams({ ...dbscanParams, eps: parseFloat(e.target.value) })}
                className="w-full accent-[#FF2E93] h-2 bg-[#090514] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>0.05 (Tight)</span>
                <span>0.50 (Moderate)</span>
                <span>1.50 (Loose)</span>
              </div>
            </div>

            {/* MinPts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-['Silkscreen'] font-bold text-white flex items-center space-x-2">
                  <span>MIN SAMPLES THRESHOLD (MINPTS):</span>
                  <span className="font-mono text-xs text-[#FF2E93] bg-[#160819] px-2 py-0.5 border border-[#FF2E93]/40 font-bold">
                    {dbscanParams.min_samples}
                  </span>
                </label>
                <span className="text-[11px] text-gray-400 font-mono">Core Point Threshold</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={dbscanParams.min_samples}
                onChange={(e) => setDbscanParams({ ...dbscanParams, min_samples: parseInt(e.target.value, 10) })}
                className="w-full accent-[#FF2E93] h-2 bg-[#090514] cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation & Launch */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1E1136]">
        <PixelButton
          variant="dark"
          size="md"
          onClick={prevStep}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          PREV [ALGORITHM]
        </PixelButton>

        <PixelButton
          variant="cyan"
          size="md"
          onClick={handleLaunch}
          disabled={isRunningAlgorithm}
          icon={<Play className="w-4 h-4 fill-current" />}
        >
          {isRunningAlgorithm ? 'COMPUTING SIMULATION...' : 'EXECUTE SIMULATION ▶'}
        </PixelButton>
      </div>
    </div>
  );
};

export default Step6_ParameterConfig;
