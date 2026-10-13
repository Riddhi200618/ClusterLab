-- ClusterLab Supabase PostgreSQL Schema
-- Minimal, extensible schema for datasets, experiments, runs, and comparisons

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DATASETS
CREATE TABLE IF NOT EXISTS datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'real_world', -- 'real_world' or 'synthetic'
    sample_count INT NOT NULL,
    feature_count INT NOT NULL,
    feature_names JSONB NOT NULL,
    default_features JSONB NOT NULL,                     -- [0, 1] for 2D plot
    raw_data JSONB NOT NULL,                             -- array of objects or vectors
    is_synthetic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. EXPERIMENTS (Student session experiment configuration)
CREATE TABLE IF NOT EXISTS experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    session_id VARCHAR(100) NOT NULL DEFAULT 'guest_student',
    dataset_id UUID REFERENCES datasets(id) ON DELETE SET NULL,
    dataset_slug VARCHAR(50) NOT NULL,
    selected_features JSONB NOT NULL,                    -- array of feature indices/names
    scaling_method VARCHAR(30) DEFAULT 'standard',       -- 'none', 'standard', 'minmax'
    sample_size INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. EXPERIMENT RUNS (Single algorithm execution results & step snapshots)
CREATE TABLE IF NOT EXISTS experiment_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
    algorithm_type VARCHAR(30) NOT NULL,                 -- 'kmeans', 'em', 'dbscan'
    hyperparameters JSONB NOT NULL,
    total_iterations INT NOT NULL DEFAULT 1,
    converged BOOLEAN NOT NULL DEFAULT TRUE,
    execution_time_ms FLOAT NOT NULL,
    silhouette_score FLOAT,
    davies_bouldin_index FLOAT,
    calinski_harabasz_index FLOAT,
    num_clusters_found INT NOT NULL,
    num_noise_points INT NOT NULL DEFAULT 0,
    final_clusters JSONB NOT NULL,                       -- array of cluster labels
    step_snapshots JSONB NOT NULL,                       -- step-by-step history
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ALGORITHM COMPARISONS (Multi-algorithm comparative results)
CREATE TABLE IF NOT EXISTS algorithm_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
    comparison_matrix JSONB NOT NULL,                    -- array of algorithm metrics
    winner_algorithm VARCHAR(30),
    educational_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for optimal lookup
CREATE INDEX IF NOT EXISTS idx_experiments_session ON experiments(session_id);
CREATE INDEX IF NOT EXISTS idx_experiment_runs_experiment ON experiment_runs(experiment_id);
CREATE INDEX IF NOT EXISTS idx_experiment_runs_algorithm ON experiment_runs(algorithm_type);
