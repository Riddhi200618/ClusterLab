import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { Sliders, ArrowRight, ArrowLeft, Check, AlertCircle, Sparkles } from 'lucide-react';

export const Step4_FeatureSelection = () => {
  const {
    datasetDetails,
    selectedFeatures,
    setSelectedFeatures,
    scalingMethod,
    setScalingMethod,
    initExperiment,
    nextStep,
    prevStep,
    loading
  } = useExperiment();

  if (!datasetDetails) {
    return null;
  }

  const { feature_names } = datasetDetails;

  const toggleFeature = (fName) => {
    if (selectedFeatures.includes(fName)) {
      if (selectedFeatures.length > 2) {
        setSelectedFeatures(selectedFeatures.filter((f) => f !== fName));
      }
    } else {
      setSelectedFeatures([...selectedFeatures, fName]);
    }
  };

  const handleProceed = async () => {
    const exp = await initExperiment();
    if (exp) {
      nextStep();
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Step 4: Feature Selection & Scaling Method</h1>
            <p className="text-xs text-gray-300">Configure dimensional inputs and apply mathematical normalization to prevent feature dominance.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Feature Selection Checkboxes */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              1. Choose Features to Cluster
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              {selectedFeatures.length} selected
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Select at least 2 features for 2D spatial coordinate mapping and distance calculation.
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {feature_names.map((fName) => {
              const isChecked = selectedFeatures.includes(fName);
              return (
                <div
                  key={fName}
                  onClick={() => toggleFeature(fName)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                    isChecked
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-white'
                      : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <span className="text-xs font-semibold capitalize">{fName.replace('_', ' ')}</span>
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                      isChecked ? 'bg-indigo-600 text-white' : 'border border-gray-700'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Scaling Method Radio Cards */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              2. Feature Normalization / Scaling
            </h3>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'standard',
                name: 'StandardScaler (Z-Score)',
                formula: 'z = (x - μ) / σ',
                desc: 'Centers features around 0 with unit variance. Recommended for Gaussian algorithms like K-Means and EM.',
              },
              {
                id: 'minmax',
                name: 'MinMaxScaler',
                formula: 'x_scaled = (x - x_min) / (x_max - x_min)',
                desc: 'Transforms all feature coordinates strictly into the [0, 1] range.',
              },
              {
                id: 'none',
                name: 'No Scaling (Raw)',
                formula: 'x_scaled = x',
                desc: 'Uses raw units. High-magnitude features will disproportionately dominate Euclidean distance.',
              },
            ].map((sc) => {
              const isSelected = scalingMethod === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setScalingMethod(sc.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400/80 ring-1 ring-cyan-400/30'
                      : 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{sc.name}</span>
                    <span className="font-mono text-[10px] text-cyan-300 bg-black/40 px-2 py-0.5 rounded border border-gray-800">
                      {sc.formula}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{sc.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Educational Note */}
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-400" />
            <span>
              <strong>Why Scale?</strong> Distance-based clustering computes Euclidean distance between coordinates. If one feature is measured in thousands (e.g. Income) and another in decimals, the larger feature will disproportionately dictate cluster geometry.
            </span>
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
          <span>Back to Preview</span>
        </button>

        <button
          onClick={handleProceed}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <span>{loading ? 'Initializing...' : 'Select Clustering Algorithm'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step4_FeatureSelection;
