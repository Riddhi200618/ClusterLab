-- ClusterLab Seed Data: Initial Datasets
-- Datasets: Iris, Wine, Mall Customers, Synthetic Blobs, Synthetic Moons, Synthetic Circles

INSERT INTO datasets (slug, name, description, category, sample_count, feature_count, feature_names, default_features, raw_data, is_synthetic)
VALUES
(
    'iris',
    'Iris Flower Dataset',
    'Classic dataset containing 150 samples of iris flowers with 4 features: sepal length, sepal width, petal length, petal width.',
    'real_world',
    150,
    4,
    '["sepal_length", "sepal_width", "petal_length", "petal_width"]'::jsonb,
    '["petal_length", "petal_width"]'::jsonb,
    '[]'::jsonb,
    FALSE
),
(
    'mall_customers',
    'Mall Customers Segmentation',
    'Customer dataset with 200 mall visitors with features including Age, Annual Income (k$), and Spending Score (1-100).',
    'real_world',
    200,
    2,
    '["annual_income", "spending_score"]'::jsonb,
    '["annual_income", "spending_score"]'::jsonb,
    '[]'::jsonb,
    FALSE
),
(
    'wine',
    'Wine Recognition Dataset',
    'Chemical analysis of 178 Italian wines grown in the same region from three different cultivars across 13 chemical features.',
    'real_world',
    178,
    13,
    '["alcohol", "malic_acid", "ash", "alcalinity_of_ash", "magnesium", "total_phenols", "flavanoids", "nonflavanoid_phenols", "proanthocyanins", "color_intensity", "hue", "od280_od315_of_diluted_wines", "proline"]'::jsonb,
    '["alcohol", "flavanoids"]'::jsonb,
    '[]'::jsonb,
    FALSE
),
(
    'synthetic_blobs',
    'Synthetic Gaussian Blobs',
    'Isotropic Gaussian blobs ideal for testing K-Means spherical assumptions and centroid convergence.',
    'synthetic',
    300,
    2,
    '["feature_1", "feature_2"]'::jsonb,
    '["feature_1", "feature_2"]'::jsonb,
    '[]'::jsonb,
    TRUE
),
(
    'synthetic_moons',
    'Synthetic Two Moons',
    'Two interleaving half circles designed to illustrate the failure modes of linear/spherical distance clustering (K-Means) and the strength of density-based clustering (DBSCAN).',
    'synthetic',
    300,
    2,
    '["feature_1", "feature_2"]'::jsonb,
    '["feature_1", "feature_2"]'::jsonb,
    '[]'::jsonb,
    TRUE
),
(
    'synthetic_circles',
    'Synthetic Concentric Circles',
    'Concentric circles with a large ring enclosing a smaller circle, showcasing non-convex boundary clustering capabilities.',
    'synthetic',
    300,
    2,
    '["feature_1", "feature_2"]'::jsonb,
    '["feature_1", "feature_2"]'::jsonb,
    '[]'::jsonb,
    TRUE
)
ON CONFLICT (slug) DO NOTHING;
