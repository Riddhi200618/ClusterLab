import React, { useState } from 'react';
import { useExperiment } from '../../context/ExperimentContext';
import { MathBlock } from '../common/MathBlock';
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
                <span className="font-sans text-[10px] text-[#00F0FF]">STAGE 1</span>
                <h1 className="font-sans text-base sm:text-lg font-bold text-white normal-case tracking-normal">
                  Clustering Basics
                </h1>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 font-sans">
                Understand how K-Means, EM and DBSCAN group similar data points.
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
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-sans normal-case font-bold border transition-all ${
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
              title="What it does"
              badge={<PixelBadge variant="cyan">CENTROID</PixelBadge>}
            >
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                K-Means divides data into K groups. Each point joins the group with the nearest centre, called a centroid.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2">
                It reduces WCSS: the sum of squared distances from points to their cluster centre.
              </p>
            </PixelCard>

            <PixelCard
              variant="purple"
              title="How it works"
              badge={<PixelBadge variant="purple">CONVERGENCE</PixelBadge>}
            >
              <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside font-sans">
                <li><strong className="text-gray-100">Assignment Step:</strong> Assign each point to its nearest centre.</li>
                <li><strong className="text-gray-100">Update Step:</strong> Move each centre to the average of its assigned points.</li>
                <li><strong className="text-gray-100">Convergence:</strong> Stop when centres barely move or the iteration limit is reached.</li>
              </ul>
            </PixelCard>
          </div>

          <MathBlock
            title="K-Means Objective Function (WCSS)"
            formula="\min_{\mathbf{S}} \sum_{k=1}^{K} \sum_{x_i \in S_k} \| x_i - \mu_k \|^2 \quad \text{where} \quad \mu_k = \frac{1}{|S_k|} \sum_{x_i \in S_k} x_i"
            description="Add the squared distance from every point to its cluster centre. Smaller WCSS means more compact clusters."
          />
        </div>
      )}

      {/* Tab 2: EM / GMM Theory */}
      {activeTab === 'em' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PixelCard
              variant="lime"
              title="What it does"
              badge={<PixelBadge variant="lime">PROBABILITY</PixelBadge>}
            >
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                EM fits Gaussian distributions to the data. Each point gets a probability of belonging to each cluster.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2">
                Each distribution has a centre (mean), a shape (covariance), and a share of the data (weight).
              </p>
            </PixelCard>

            <PixelCard
              variant="purple"
              title="How it works"
              badge={<PixelBadge variant="purple">EM</PixelBadge>}
            >
              <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside font-sans">
                <li><strong className="text-gray-100">E-Step (Expectation):</strong> Calculate each point's probability of belonging to each cluster.</li>
                <li><strong className="text-gray-100">M-Step (Maximization):</strong> Update cluster means, shapes and weights using those probabilities.</li>
                <li><strong className="text-gray-100">Convergence:</strong> Repeat until the improvement is small or the iteration limit is reached.</li>
              </ul>
            </PixelCard>
          </div>

          <MathBlock
            title="E-Step Responsibilities & M-Step Parameters"
            formula="\gamma_{ik} = \frac{\pi_k \mathcal{N}(x_i \mid \mu_k, \Sigma_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(x_i \mid \mu_j, \Sigma_j)}, \quad \mu_k^{(t+1)} = \frac{\sum_{i} \gamma_{ik} x_i}{\sum_{i} \gamma_{ik}}, \quad \Sigma_k^{(t+1)} = \frac{\sum_{i} \gamma_{ik}(x_i - \mu_k)(x_i - \mu_k)^T}{\sum_{i} \gamma_{ik}}"
            description="The E-step estimates membership probabilities. The M-step uses them to update each Gaussian distribution."
          />
        </div>
      )}

      {/* Tab 3: DBSCAN Theory */}
      {activeTab === 'dbscan' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PixelCard
              variant="pink"
              title="What it does"
              badge={<PixelBadge variant="pink">SPATIAL</PixelBadge>}
            >
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                DBSCAN groups points in dense regions and marks isolated points as noise. Clusters can have irregular shapes.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2">
                Its two settings are eps (neighbour distance) and minimum points (the density needed to form a cluster).
              </p>
            </PixelCard>

            <PixelCard
              variant="purple"
              title="Types of points"
              badge={<PixelBadge variant="purple">POINT TYPES</PixelBadge>}
            >
              <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside font-sans">
                <li><strong className="text-emerald-400">Core Point:</strong> Has enough points within eps, counting itself.</li>
                <li><strong className="text-[#00F0FF]">Border Point:</strong> Has too few neighbours to be core, but is within eps of a core point.</li>
                <li><strong className="text-[#FF2E93]">Noise Point:</strong> Does not belong to any cluster.</li>
              </ul>
            </PixelCard>
          </div>

          <MathBlock
            title="DBSCAN Density Reachability Condition"
            formula="N_\varepsilon(p) = \{q \in D \mid \text{dist}(p, q) \le \varepsilon\}, \quad p \in \text{Core} \iff |N_\varepsilon(p)| \ge \text{MinPts}"
            description="eps defines the neighbourhood. MinPts defines a core point. DBSCAN finds the number of clusters automatically."
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
