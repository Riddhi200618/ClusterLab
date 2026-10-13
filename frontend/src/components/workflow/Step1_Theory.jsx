import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { MathBlock } from '../common/MathBlock';
import { BookOpen, Cpu, Sparkles, ArrowRight, Layers, Target, Activity } from 'lucide-react';

export const Step1_Theory = () => {
  const { nextStep } = useExperiment();
  const [activeTab, setActiveTab] = useState('kmeans');

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Step 1: Introduction & Theoretical Foundations</h1>
            <p className="text-xs text-gray-300">Master the mathematical mechanics and geometric intuitions behind unsupervised clustering.</p>
          </div>
        </div>
      </div>

      {/* Algorithm Theory Tabs */}
      <div className="flex border-b border-gray-800 space-x-2">
        {[
          { id: 'kmeans', name: '1. K-Means (Centroid)', icon: Target },
          { id: 'em', name: '2. Expectation Maximization (Probabilistic)', icon: Activity },
          { id: 'dbscan', name: '3. DBSCAN (Density-Based)', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                isActive
                  ? 'bg-gray-800/80 text-cyan-400 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: K-Means Theory */}
      {activeTab === 'kmeans' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-xl space-y-3 border border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Core Intuition & Objective</span>
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                K-Means partitions $N$ observations into $K$ non-overlapping spherical clusters. Each point belongs to the cluster with the nearest mean (centroid), serving as a prototype of the cluster.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                The algorithm minimizes the Within-Cluster Sum of Squares (WCSS), also known as inertia or total squared error.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-xl space-y-3 border border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>The 2-Phase Lloyd's Iteration</span>
              </h3>
              <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
                <li><strong className="text-gray-100">Assignment Step:</strong> Assign each data point $x_i$ to its nearest centroid $\mu_k$.</li>
                <li><strong className="text-gray-100">Update Step:</strong> Recompute each centroid $\mu_k$ as the arithmetic mean of all points assigned to cluster $k$.</li>
                <li><strong className="text-gray-100">Convergence:</strong> Stops when centroid movements fall below tolerance $\varepsilon$ or max iterations are reached.</li>
              </ul>
            </div>
          </div>

          <MathBlock
            title="K-Means Objective Function (WCSS)"
            formula="\min_{\mathbf{S}} \sum_{k=1}^{K} \sum_{x_i \in S_k} \| x_i - \mu_k \|^2 \quad \text{where} \quad \mu_k = \frac{1}{|S_k|} \sum_{x_i \in S_k} x_i"
            description="WCSS measures the compactness of the clusters. Minimizing WCSS corresponds to finding the maximum likelihood estimate under an isotropic Gaussian mixture assumption."
          />
        </div>
      )}

      {/* Tab 2: EM / GMM Theory */}
      {activeTab === 'em' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-xl space-y-3 border border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Soft Clustering via Gaussian Mixtures</span>
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Unlike hard assignments in K-Means, Expectation Maximization (EM) computes the posterior probability (responsibility $\gamma_{ik}$) that sample $i$ was generated by Gaussian component $k$.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Each component is defined by its mean vector $\mu_k$, covariance matrix $\Sigma_k$ (modeling cluster orientation and elongation), and mixture weight prior $\pi_k$.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-xl space-y-3 border border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>E-Step & M-Step Optimization</span>
              </h3>
              <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
                <li><strong className="text-gray-100">E-Step (Expectation):</strong> Calculate responsibilities $\gamma_{ik}$ using Bayes' Rule and the multivariate normal PDF.</li>
                <li><strong className="text-gray-100">M-Step (Maximization):</strong> Update weights $\pi_k$, means $\mu_k$, and covariance matrices $\Sigma_k$ using the weighted sample moments.</li>
                <li><strong className="text-gray-100">Convergence:</strong> Guaranteed to monotonically increase the total mixture log-likelihood.</li>
              </ul>
            </div>
          </div>

          <MathBlock
            title="E-Step Responsibilities & M-Step Parameters"
            formula="\gamma_{ik} = \frac{\pi_k \mathcal{N}(x_i \mid \mu_k, \Sigma_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(x_i \mid \mu_j, \Sigma_j)}, \quad \mu_k^{(t+1)} = \frac{\sum_{i} \gamma_{ik} x_i}{\sum_{i} \gamma_{ik}}, \quad \Sigma_k^{(t+1)} = \frac{\sum_{i} \gamma_{ik}(x_i - \mu_k)(x_i - \mu_k)^T}{\sum_{i} \gamma_{ik}}"
            description="The EM algorithm iteratively finds the Maximum Likelihood Estimates (MLE) of the mixture parameters in the presence of unobserved latent cluster assignments."
          />
        </div>
      )}

      {/* Tab 3: DBSCAN Theory */}
      {activeTab === 'dbscan' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-xl space-y-3 border border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Density-Based Reachability</span>
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                DBSCAN (Density-Based Spatial Clustering of Applications with Noise) groups points based on local spatial density. It discovers clusters of arbitrary shapes and isolates low-density outliers as noise.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Two key hyperparameters dictate the clustering behavior: $\varepsilon$ (Epsilon neighborhood radius) and $\text{MinPts}$ (minimum density threshold).
              </p>
            </div>

            <div className="glass-panel p-5 rounded-xl space-y-3 border border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                <span>Point Classification Categories</span>
              </h3>
              <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside">
                <li><strong className="text-emerald-300">Core Point:</strong> Has at least $\text{MinPts}$ neighbors within radius $\varepsilon$ ($|N_\varepsilon(p)| \ge \text{MinPts}$).</li>
                <li><strong className="text-cyan-300">Border Point:</strong> Has fewer than $\text{MinPts}$ neighbors, but is density-reachable from a Core Point.</li>
                <li><strong className="text-rose-400">Noise Point:</strong> Neither a Core nor Border point; isolated outlier.</li>
              </ul>
            </div>
          </div>

          <MathBlock
            title="DBSCAN Density Reachability Condition"
            formula="N_\varepsilon(p) = \{q \in D \mid \text{dist}(p, q) \le \varepsilon\}, \quad p \in \text{Core} \iff |N_\varepsilon(p)| \ge \text{MinPts}"
            description="Clusters are formed as maximal sets of density-connected points. DBSCAN does not require pre-specifying the number of clusters K."
          />
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-end pt-4">
        <button
          onClick={nextStep}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <span>Proceed to Dataset Selection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step1_Theory;
