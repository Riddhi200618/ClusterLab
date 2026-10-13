import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const api = {
  // Datasets
  getDatasets: async () => {
    const response = await apiClient.get('/datasets');
    return response.data;
  },

  getDatasetDetails: async (slug, params = {}) => {
    const response = await apiClient.get(`/datasets/${slug}`, { params });
    return response.data;
  },

  generateSyntheticDataset: async (payload) => {
    const response = await apiClient.post('/datasets/synthetic/generate', payload);
    return response.data;
  },

  // Experiments
  createExperiment: async (payload) => {
    const response = await apiClient.post('/experiments', payload);
    return response.data;
  },

  getExperiment: async (experimentId) => {
    const response = await apiClient.get(`/experiments/${experimentId}`);
    return response.data;
  },

  getHistory: async (sessionId = 'guest_student') => {
    const response = await apiClient.get('/experiments/history', {
      params: { session_id: sessionId },
    });
    return response.data;
  },

  // Algorithms Execution
  runKMeans: async (payload) => {
    const response = await apiClient.post('/algorithms/kmeans/run', payload);
    return response.data;
  },

  runEM: async (payload) => {
    const response = await apiClient.post('/algorithms/em/run', payload);
    return response.data;
  },

  runDBSCAN: async (payload) => {
    const response = await apiClient.post('/algorithms/dbscan/run', payload);
    return response.data;
  },

  // Evaluation & Comparison
  evaluateSilhouette: async (experimentId, labels) => {
    const response = await apiClient.post('/evaluation/silhouette', {
      experiment_id: experimentId,
      labels,
    });
    return response.data;
  },

  compareAlgorithms: async (experimentId, runIds = null) => {
    const response = await apiClient.post('/evaluation/compare', {
      experiment_id: experimentId,
      run_ids: runIds,
    });
    return response.data;
  },
};

export default api;
