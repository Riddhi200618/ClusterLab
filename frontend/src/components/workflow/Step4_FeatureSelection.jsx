import React from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { Sliders, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border border-[#231542] bg-[#0E091C] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-[#00F0FF]/40 bg-[#0B1226] flex items-center justify-center text-cyan-300 shadow-sm">
              <Sliders className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-['Press_Start_2P'] text-[10px] text-[#00F0FF]">STAGE 2</span>
                <h1 className="font-['Silkscreen'] text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Feature Selection & Normalization
                </h1>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 font-sans">
                Select feature dimensions and apply mathematical normalization to standardize feature scale across dimensions.
              </p>
            </div>
          </div>

          <PixelBadge variant="purple">
            PREPROCESSING
          </PixelBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Feature Selection Checkboxes */}
        <div className="border border-[#20133A] bg-[#0E091C] p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1E1136]">
            <h3 className="font-['Silkscreen'] text-xs font-bold text-white uppercase tracking-wider">
              1. Select Feature Dimensions (Min 2)
            </h3>
            <span className="font-mono text-xs text-[#00F0FF]">
              {selectedFeatures.length} SELECTED
            </span>
          </div>

          <p className="text-xs text-gray-400 font-sans">
            Select at least 2 coordinate dimensions for spatial distance computation and visualization.
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {feature_names.map((fName) => {
              const isChecked = selectedFeatures.includes(fName);
              return (
                <div
                  key={fName}
                  onClick={() => toggleFeature(fName)}
                  className={`flex items-center justify-between p-2.5 border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-[#00F0FF] bg-[#0C152B] text-white shadow-sm'
                      : 'border-[#20133A] bg-[#0A0617] text-gray-400 hover:border-[#3A2269]'
                  }`}
                >
                  <span className="text-xs font-['Silkscreen'] font-bold capitalize">
                    {fName.replace('_', ' ')}
                  </span>
                  <div
                    className={`w-4 h-4 border flex items-center justify-center font-mono text-[10px] ${
                      isChecked
                        ? 'border-[#00F0FF] bg-[#00F0FF] text-[#050510] font-bold'
                        : 'border-[#3D256B] bg-transparent text-transparent'
                    }`}
                  >
                    {isChecked ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Scaling Method Radio Cards */}
        <div className="border border-[#20133A] bg-[#0E091C] p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1E1136]">
            <h3 className="font-['Silkscreen'] text-xs font-bold text-white uppercase tracking-wider">
              2. Normalization Protocol
            </h3>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: 'standard',
                name: 'StandardScaler (Z-Score)',
                formula: 'z = (x - μ) / σ',
                desc: 'Centers around 0 with unit variance. Recommended for Gaussian algorithms (K-Means & EM).',
              },
              {
                id: 'minmax',
                name: 'MinMaxScaler',
                formula: 'x_scaled = (x - min) / (max - min)',
                desc: 'Transforms all feature coordinates strictly into the [0, 1] range.',
              },
              {
                id: 'none',
                name: 'No Scaling (Raw Coordinates)',
                formula: 'x_scaled = x',
                desc: 'Uses raw units. High-magnitude features will disproportionately dominate Euclidean distance.',
              },
            ].map((sc) => {
              const isSelected = scalingMethod === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setScalingMethod(sc.id)}
                  className={`p-3 border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500/80 bg-[#08150D] shadow-sm'
                      : 'border-[#20133A] bg-[#0A0617] hover:border-[#3A2269]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['Silkscreen'] text-xs font-bold text-white">{sc.name}</span>
                    <span className="font-mono text-[10px] text-[#39FF14] bg-black/40 px-2 py-0.5 border border-emerald-900/60">
                      {sc.formula}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-sans leading-relaxed">{sc.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Educational Note */}
          <div className="p-3 border border-amber-500/30 bg-[#140F06] text-xs text-amber-200 flex items-start space-x-2 font-sans">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-400" />
            <span className="leading-relaxed">
              <strong className="text-white">Why Normalization Matters:</strong> Distance metrics compute Euclidean distances. If income is 80,000 and age is 35, the income magnitude will overwhelm age by 2000x without scaling!
            </span>
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
          PREV [PREVIEW]
        </PixelButton>

        <PixelButton
          variant="cyan"
          size="md"
          onClick={handleProceed}
          disabled={loading}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {loading ? 'INITIALIZING...' : 'NEXT: ALGORITHM SELECT [STAGE 3]'}
        </PixelButton>
      </div>
    </div>
  );
};

export default Step4_FeatureSelection;
