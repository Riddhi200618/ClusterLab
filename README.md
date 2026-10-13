# ClusterLab – Interactive Virtual Laboratory for Clustering Algorithms

**ClusterLab** is a specialized, educational Virtual Laboratory for Machine Learning students to explore, visualize, and compare clustering algorithms (**K-Means**, **Expectation Maximization / GMM**, and **DBSCAN**) through an interactive 11-step guided laboratory workflow.

---

## 🔬 Core Learning Objectives

1. **White-Box Educational Step Recorders**:
   - **K-Means**: Centroid initialization (Random vs K-Means++), Euclidean distance mapping, cluster assignments, centroid recalculation, and WCSS objective convergence tracking.
   - **Expectation Maximization (EM / GMM)**: Mixture priors $\pi_k$, E-Step responsibilities $\gamma_{ik}$ (soft assignments), M-Step covariance and mean updates, 2D $1\sigma / 2\sigma$ Gaussian confidence ellipses, and log-likelihood maximization.
   - **DBSCAN**: Epsilon ($\varepsilon$) search radius, MinPts density thresholds, spatial neighborhood queries, Core vs Border vs Noise point classification, and Breadth-First cluster frontier propagation.
2. **Quantitative Clustering Quality Evaluation**:
   - Comprehensive **Silhouette Score** calculation with per-sample horizontal bar plots ($s(i) = \frac{b(i)-a(i)}{\max(a(i), b(i))}$).
   - **Davies-Bouldin Index** and **Calinski-Harabasz Index**.
3. **Multi-Algorithm Comparison Matrix**:
   - Run K-Means, EM, and DBSCAN on identical preprocessed datasets side-by-side with synchronized scorecards and automated trade-off analysis.
4. **Database Persistence**:
   - Supabase PostgreSQL schema and client with local storage fallback for offline/development mode.

---

## 📁 System Architecture & Directory Structure

```
ClusterLab/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entry point & CORS
│   │   ├── core/
│   │   │   ├── config.py               # Pydantic Settings
│   │   │   └── database.py             # Supabase client & local storage fallback
│   │   ├── models/                     # Pydantic validation schemas
│   │   │   ├── dataset.py
│   │   │   ├── experiment.py
│   │   │   ├── kmeans.py
│   │   │   ├── em.py
│   │   │   ├── dbscan.py
│   │   │   └── evaluation.py
│   │   ├── ml/                         # Educational ML Core & Step Recorders
│   │   │   ├── datasets/               # Iris, Wine, Mall Customers, Synthetic (Blobs, Moons, Circles)
│   │   │   ├── preprocessor.py         # StandardScaler, MinMaxScaler
│   │   │   ├── algorithms/             # kmeans_stepper.py, em_stepper.py, dbscan_stepper.py
│   │   │   └── evaluation.py           # Silhouette analysis & metrics
│   │   ├── api/                        # REST API Routers (/datasets, /experiments, /algorithms, /evaluation)
│   │   └── services/                   # Business logic coordination
│   ├── tests/                          # 7 Pytest unit & integration tests
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                     # 11-step workflow manager
│   │   ├── context/
│   │   │   └── ExperimentContext.jsx   # State machine & simulation playback loop
│   │   ├── components/
│   │   │   ├── layout/                 # Navbar, LabStepper
│   │   │   ├── common/                 # MathBlock (LaTeX formulas)
│   │   │   ├── visualization/          # PlotlyWrapper, StepperControls, SilhouettePlot, ConvergencePlot, ComparisonGrid
│   │   │   └── workflow/               # 11 Guided Step Components
│   │   └── services/
│   │       └── api.js                  # Axios client to FastAPI
│   ├── package.json
│   └── vite.config.js
│
└── supabase/
    ├── schema.sql                      # PostgreSQL DDL migrations
    └── seed.sql                        # Benchmark datasets seed
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 2. Backend Setup
```bash
# Navigate to backend directory and install dependencies
pip install -r backend/requirements.txt

# Run test suite to verify ML steppers and APIs
python -m pytest backend/tests -v

# Start the FastAPI backend server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*API will be live at `http://127.0.0.1:8000` (Docs at `http://127.0.0.1:8000/docs`).*

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Virtual Laboratory UI will be accessible at `http://localhost:5173`.*

---

## 🧪 11-Step Guided Student Workflow

| Step | Phase | Functionality |
| :--- | :--- | :--- |
| **1** | **Theory** | Interactive mathematical foundations, Lloyd's algorithm, EM Bayes updates, and density reachability. |
| **2** | **Dataset Selection** | Choose real-world (Iris, Wine, Mall Customers) or configure synthetic (Blobs, Moons, Circles) datasets. |
| **3** | **Dataset Preview** | Summary statistics (mean, std, min, max), sample tables, and raw 2D scatter preview. |
| **4** | **Feature Selection** | Select input features (2D/3D) and apply normalization (`StandardScaler`, `MinMaxScaler`, `None`). |
| **5** | **Algorithm Selection** | Choose between **K-Means**, **Expectation Maximization (EM)**, or **DBSCAN**. |
| **6** | **Parameter Tuning** | Configure hyperparameters ($K$, initialization method, covariance matrix, $\varepsilon$, MinPts). |
| **7** | **Step-by-Step Simulation** | Interactive playback controller (Play, Pause, Step Next/Prev, Speed slider) with live LaTeX formula updates and plain-English step explanations. |
| **8** | **Interactive Visualization** | Full-screen Plotly canvas with dynamic cluster boundaries, centroid traces, Gaussian ellipses, and 2D/3D mode toggling. |
| **9** | **Clustering Evaluation** | Quantitative evaluation dashboard featuring sample-level Silhouette Plots, Davies-Bouldin, and Calinski-Harabasz metrics. |
| **10** | **Algorithm Comparison** | 3-way side-by-side comparison matrix with automated educational performance commentary. |
| **11** | **History & Report** | Saved Supabase runs timeline with printable Student Lab Experiment Report. |

---

## 🛡️ Database Configuration (Supabase PostgreSQL)

By default, ClusterLab runs out-of-the-box in **standalone local mode**. To enable live cloud persistence with Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Execute `supabase/schema.sql` and `supabase/seed.sql` in the Supabase SQL Editor.
3. Add your Supabase credentials to `.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```
