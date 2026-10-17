import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';

const ExperimentContext = createContext(null);

export const ExperimentProvider = ({ children }) => {
  // Workflow Step: 1 to 11
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set([1]));

  // Dataset State
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetSlug, setSelectedDatasetSlug] = useState('iris');
  const [datasetDetails, setDatasetDetails] = useState(null);
  const [syntheticParams, setSyntheticParams] = useState({
    dataset_type: 'blobs',
    n_samples: 300,
    noise: 0.08,
    centers: 3,
    cluster_std: 0.8,
    random_state: 42,
  });

  // Feature Selection & Preprocessing
  const [selectedFeatures, setSelectedFeatures] = useState(['petal_length', 'petal_width']);
  const [scalingMethod, setScalingMethod] = useState('standard');
  const [activeExperiment, setActiveExperiment] = useState(null);

  // Algorithm Selection & Hyperparameters
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('kmeans'); // 'kmeans', 'em', 'dbscan'

  const [kmeansParams, setKmeansParams] = useState({
    k: 3,
    init_method: 'k-means++',
    max_iter: 50,
    tol: 0.0001,
    random_state: 42,
  });

  const [emParams, setEmParams] = useState({
    n_components: 3,
    covariance_type: 'full',
    max_iter: 50,
    tol: 0.001,
    random_state: 42,
  });

  const [dbscanParams, setDbscanParams] = useState({
    eps: 0.5,
    min_samples: 5,
    metric: 'euclidean',
  });

  // Execution & Step-by-step Playback
  const [simulationResult, setSimulationResult] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.25x, 0.5x, 1x, 2x
  const [isRunningAlgorithm, setIsRunningAlgorithm] = useState(false);

  // Evaluation & Comparison
  const [silhouetteDetails, setSilhouetteDetails] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [historyList, setHistoryList] = useState([]);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const playbackTimerRef = useRef(null);

  // Fetch Dataset Details
  const loadDatasetDetails = async (slug, customParams = null) => {
    try {
      setLoading(true);
      setError(null);
      const details = await api.getDatasetDetails(slug, customParams);
      setDatasetDetails(details);
      setSelectedDatasetSlug(slug);
      setSelectedFeatures(details.default_features || details.feature_names.slice(0, 2));
      setActiveExperiment(null);
      setSimulationResult(null);
      setSilhouetteDetails(null);
      setComparisonResult(null);
    } catch (err) {
      console.error(`Error loading dataset ${slug}:`, err);
      setError(`Failed to load dataset details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate Synthetic Dataset
  const generateSynthetic = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const details = await api.generateSyntheticDataset(params);
      setDatasetDetails(details);
      setSelectedDatasetSlug(details.slug);
      setSyntheticParams(params);
      setSelectedFeatures(details.feature_names.slice(0, 2));
      setActiveExperiment(null);
      setSimulationResult(null);
      setSilhouetteDetails(null);
      setComparisonResult(null);
    } catch (err) {
      console.error('Error generating synthetic dataset:', err);
      setError(`Failed to generate synthetic dataset: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load Initial Datasets List
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true);
        const list = await api.getDatasets();
        setDatasets(list);
        if (list.length > 0) {
          loadDatasetDetails('iris');
        }
      } catch (err) {
        console.error('Failed to load datasets:', err);
        setError('Could not connect to FastAPI backend. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, []);

  // Create Experiment Session
  const initExperiment = async () => {
    if (!datasetDetails) return null;
    try {
      setLoading(true);
      setError(null);
      const exp = await api.createExperiment({
        title: `${datasetDetails.name} Lab Session`,
        session_id: 'guest_student',
        dataset_slug: selectedDatasetSlug,
        selected_features: selectedFeatures,
        scaling_method: scalingMethod,
        custom_synthetic_params: selectedDatasetSlug.startsWith('synthetic_') ? syntheticParams : null,
      });
      setActiveExperiment(exp);
      markStepComplete(4);
      return exp;
    } catch (err) {
      console.error('Error creating experiment:', err);
      setError(`Failed to create experiment: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Run Selected Algorithm
  const executeAlgorithm = async () => {
    let exp = activeExperiment;
    if (!exp) {
      exp = await initExperiment();
      if (!exp) return;
    }

    try {
      setIsRunningAlgorithm(true);
      setError(null);
      let result = null;

      if (selectedAlgorithm === 'kmeans') {
        result = await api.runKMeans({
          experiment_id: exp.id,
          ...kmeansParams,
        });
      } else if (selectedAlgorithm === 'em') {
        result = await api.runEM({
          experiment_id: exp.id,
          ...emParams,
        });
      } else if (selectedAlgorithm === 'dbscan') {
        result = await api.runDBSCAN({
          experiment_id: exp.id,
          ...dbscanParams,
        });
      }

      setSimulationResult(result);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      markStepComplete(6);
      markStepComplete(7);
      markStepComplete(8);

      // Auto-fetch silhouette analysis
      if (result && result.final_clusters) {
        try {
          const sil = await api.evaluateSilhouette(exp.id, result.final_clusters);
          setSilhouetteDetails(sil);
          markStepComplete(9);
        } catch (silErr) {
          console.warn('Silhouette evaluation warning:', silErr);
        }
      }
    } catch (err) {
      console.error('Error running algorithm:', err);
      setError(`Execution error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setIsRunningAlgorithm(false);
    }
  };

  // Run Multi-Algorithm Comparison
  const runComparison = async () => {
    let exp = activeExperiment;
    if (!exp) {
      exp = await initExperiment();
      if (!exp) return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.compareAlgorithms(exp.id);
      setComparisonResult(res);
      markStepComplete(10);
    } catch (err) {
      console.error('Error running comparison:', err);
      setError(`Comparison error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load Experiment History
  const loadHistory = async () => {
    try {
      const history = await api.getHistory('guest_student');
      setHistoryList(history);
      markStepComplete(11);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  // Step Completion Marker
  const markStepComplete = (stepNumber) => {
    setCompletedSteps((prev) => new Set([...prev, stepNumber]));
  };

  // Navigation handlers
  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= 11) {
      setCurrentStep(stepNumber);
      markStepComplete(stepNumber);
    }
  };

  const nextStep = () => {
    if (currentStep < 11) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // Playback Animation Loop
  useEffect(() => {
    if (isPlaying && simulationResult && simulationResult.steps) {
      const totalSteps = simulationResult.steps.length;
      const intervalMs = Math.max(100, 1000 / playbackSpeed);

      playbackTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);

      return () => clearInterval(playbackTimerRef.current);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    }
  }, [isPlaying, simulationResult, playbackSpeed]);

  const value = {
    currentStep,
    completedSteps,
    goToStep,
    nextStep,
    prevStep,
    datasets,
    selectedDatasetSlug,
    setSelectedDatasetSlug,
    datasetDetails,
    loadDatasetDetails,
    syntheticParams,
    setSyntheticParams,
    generateSynthetic,
    selectedFeatures,
    setSelectedFeatures,
    scalingMethod,
    setScalingMethod,
    activeExperiment,
    initExperiment,
    selectedAlgorithm,
    setSelectedAlgorithm,
    kmeansParams,
    setKmeansParams,
    emParams,
    setEmParams,
    dbscanParams,
    setDbscanParams,
    simulationResult,
    currentStepIndex,
    setCurrentStepIndex,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    isRunningAlgorithm,
    executeAlgorithm,
    silhouetteDetails,
    comparisonResult,
    runComparison,
    historyList,
    loadHistory,
    loading,
    error,
    setError,
  };

  return <ExperimentContext.Provider value={value}>{children}</ExperimentContext.Provider>;
};

export const useExperiment = () => {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperiment must be used within an ExperimentProvider');
  }
  return context;
};
