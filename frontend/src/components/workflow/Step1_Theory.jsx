import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { MathBlock, InlineMath } from '../common/MathBlock';
import { PixelBadge } from '../common/PixelBadge';
import { PixelButton } from '../common/PixelButton';
import { PixelCard } from '../common/PixelCard';
import { PixelTarget, PixelFlask, PixelJoystick } from '../common/PixelIcons';
import { BookOpen, ArrowRight } from 'lucide-react';

export const Step1_Theory = () => {
  const { nextStep } = useExperiment();
  const [activeTab, setActiveTab] = useState('kmeans');

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border border-[#231542] bg-[#0E091C] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 border border-[#00F0FF]/40 bg-[#0B1226] flex items-center justify-center text-cyan-300 shadow-sm">
              <BookOpen className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-['Press_Start_2P'] text-[10px] text-[#00F0FF]">STAGE 1</span>
                <h1 className="font-['Silkscreen'] text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Clustering Theory & Foundations
                </h1>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 font-sans">
                Foundational mathematical mechanics, objective functions, and algorithmic updates for K-Means, EM/GMM, and DBSCAN.
              </p>
            </div>
          </div>

          <PixelBadge variant="purple">
            THEORY GUIDE
          </PixelBadge>
        </div>
      </div>

      {/* Algorithm Theory Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#1E1136] pb-2">
        {[
          { id: 'kmeans', name: '1. K-Means (Centroid)', icon: PixelTarget, color: 'cyan' },
          { id: 'em', name: '2. EM / GMM (Probabilistic)', icon: PixelFlask, color: 'lime' },
          { id: 'dbscan', name: '3. DBSCAN (Density-Based)', icon: PixelJoystick, color: 'pink' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-['Silkscreen'] uppercase font-bold border transition-all ${
                isActive
                  ? 'bg-[#0B1426] border-[#00F0FF] text-white shadow-sm'
                  : 'bg-[#0E091C] border-[#20133A] text-gray-400 hover:text-white hover:border-[#3A2269] shadow-sm'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: K-Means Theory */}
      {activeTab === 'kmeans' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PixelCard
              variant="cyan"
              title="Core Intuition & Objective"
              badge={<PixelBadge variant="cyan">CENTROID</PixelBadge>}
            >
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                K-Means partitions <InlineMath math="N" /> observations into <InlineMath math="K" /> non-overlapping spherical clusters. Each point belongs to the cluster with the nearest mean (centroid), serving as a prototype of the cluster.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2">
                The algorithm minimizes the Within-Cluster Sum of Squares (WCSS), also known as inertia or total squared error.
              </p>
            </PixelCard>

            <PixelCard
              variant="purple"
              title="Lloyd's 2-Phase Iteration"
              badge={<PixelBadge variant="purple">CONVERGENCE</PixelBadge>}
            >
              <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside font-sans">
                <li><strong className="text-gray-100">Assignment Step:</strong> Assign each data point <InlineMath math="x_i" /> to its nearest centroid <InlineMath math="\mu_k" />.</li>
                <li><strong className="text-gray-100">Update Step:</strong> Recompute each centroid <InlineMath math="\mu_k" /> as the arithmetic mean of all points assigned to cluster <InlineMath math="k" />.</li>
                <li><strong className="text-gray-100">Convergence:</strong> Stops when centroid movements fall below tolerance <InlineMath math="\varepsilon" /> or max iterations are reached.</li>
              </ul>
            </PixelCard>
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
            <PixelCard
              variant="lime"
              title="Soft Mixture Modeling"
              badge={<PixelBadge variant="lime">PROBABILITY</PixelBadge>}
            >
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Unlike hard assignments in K-Means, Expectation Maximization (EM) computes the posterior probability (responsibility <InlineMath math="\gamma_{ik}" />) that sample <InlineMath math="i" /> was generated by Gaussian component <InlineMath math="k" />.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2">
                Each component is defined by its mean vector <InlineMath math="\mu_k" />, covariance matrix <InlineMath math="\Sigma_k" /> (modeling cluster orientation and elongation), and mixture weight prior <InlineMath math="\pi_k" />.
              </p>
            </PixelCard>

            <PixelCard
              variant="purple"
              title="E-Step & M-Step Optimization"
              badge={<PixelBadge variant="purple">MLE</PixelBadge>}
            >
              <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside font-sans">
                <li><strong className="text-gray-100">E-Step (Expectation):</strong> Calculate responsibilities <InlineMath math="\gamma_{ik}" /> using Bayes' Rule and the multivariate normal PDF.</li>
                <li><strong className="text-gray-100">M-Step (Maximization):</strong> Update weights <InlineMath math="\pi_k" />, means <InlineMath math="\mu_k" />, and covariance matrices <InlineMath math="\Sigma_k" /> using the weighted sample moments.</li>
                <li><strong className="text-gray-100">Convergence:</strong> Guaranteed to monotonically increase the total mixture log-likelihood.</li>
              </ul>
            </PixelCard>
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
            <PixelCard
              variant="pink"
              title="Density-Based Reachability"
              badge={<PixelBadge variant="pink">SPATIAL</PixelBadge>}
            >
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                DBSCAN (Density-Based Spatial Clustering of Applications with Noise) groups points based on local spatial density. It discovers clusters of arbitrary shapes and isolates low-density outliers as noise.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2">
                Two key hyperparameters dictate the clustering behavior: <InlineMath math="\varepsilon" /> (Epsilon neighborhood radius) and <InlineMath math="\text{MinPts}" /> (minimum density threshold).
              </p>
            </PixelCard>

            <PixelCard
              variant="purple"
              title="Point Classification Categories"
              badge={<PixelBadge variant="purple">TRINARY</PixelBadge>}
            >
              <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside font-sans">
                <li><strong className="text-emerald-400">Core Point:</strong> Has at least <InlineMath math="\text{MinPts}" /> neighbors within radius <InlineMath math="\varepsilon" /> (<InlineMath math="|N_\varepsilon(p)| \ge \text{MinPts}" />).</li>
                <li><strong className="text-[#00F0FF]">Border Point:</strong> Has fewer than <InlineMath math="\text{MinPts}" /> neighbors, but is density-reachable from a Core Point.</li>
                <li><strong className="text-[#FF2E93]">Noise Point:</strong> Neither a Core nor Border point; isolated outlier.</li>
              </ul>
            </PixelCard>
          </div>

          <MathBlock
            title="DBSCAN Density Reachability Condition"
            formula="N_\varepsilon(p) = \{q \in D \mid \text{dist}(p, q) \le \varepsilon\}, \quad p \in \text{Core} \iff |N_\varepsilon(p)| \ge \text{MinPts}"
            description="Clusters are formed as maximal sets of density-connected points. DBSCAN does not require pre-specifying the number of clusters $K$."
          />
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-end pt-4 border-t border-[#1E1136]">
        <PixelButton
          variant="cyan"
          size="md"
          onClick={nextStep}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          NEXT: PREPARE DATA [STAGE 2]
        </PixelButton>
      </div>
    </div>
  );
};

export default Step1_Theory;
