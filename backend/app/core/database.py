import os
import json
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
import uuid
import httpx
from backend.app.core.config import settings

logger = logging.getLogger("clusterlab.database")

# Explicit whitelist of schema columns matching supabase/schema.sql
DATASET_COLUMNS = {
    "id", "slug", "name", "description", "category",
    "sample_count", "feature_count", "feature_names", "default_features",
    "raw_data", "is_synthetic", "created_at"
}

EXPERIMENT_COLUMNS = {
    "id", "title", "session_id", "dataset_id", "dataset_slug",
    "selected_features", "scaling_method", "sample_size",
    "created_at", "updated_at"
}

EXPERIMENT_RUN_COLUMNS = {
    "id", "experiment_id", "algorithm_type", "hyperparameters",
    "total_iterations", "converged", "execution_time_ms",
    "silhouette_score", "davies_bouldin_index", "calinski_harabasz_index",
    "num_clusters_found", "num_noise_points", "final_clusters",
    "step_snapshots", "created_at"
}

ALGORITHM_COMPARISON_COLUMNS = {
    "id", "experiment_id", "comparison_matrix", "winner_algorithm",
    "educational_summary", "created_at"
}

def _filter_payload(data: Dict[str, Any], allowed_columns: set) -> Dict[str, Any]:
    """Filter out non-schema / memory-only fields before sending to PostgREST."""
    return {k: v for k, v in data.items() if k in allowed_columns}

class DatabaseClient:
    def __init__(self):
        self.use_supabase = False
        self.supabase_url = settings.SUPABASE_URL.rstrip('/') if settings.SUPABASE_URL else ""
        self.supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
        self._local_db = {
            "datasets": {},
            "experiments": {},
            "experiment_runs": {},
            "algorithm_comparisons": {}
        }
        self._init_client()

    def _init_client(self):
        if (
            self.supabase_url
            and self.supabase_key
            and "supabase.co" in self.supabase_url
            and settings.APP_ENV != "testing"
        ):
            self.use_supabase = True
            logger.info("Supabase PostgreSQL REST connection configured and active.")
        else:
            logger.info("Supabase credentials not set, incomplete, or in testing mode. Running in local fallback mode.")
            self.use_supabase = False

    def _get_headers(self) -> Dict[str, str]:
        return {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

    def get_datasets(self) -> List[Dict[str, Any]]:
        if self.use_supabase:
            try:
                url = f"{self.supabase_url}/rest/v1/datasets?select=*"
                with httpx.Client(timeout=10.0) as client:
                    r = client.get(url, headers=self._get_headers())
                    if r.status_code in (200, 201):
                        return r.json()
                    else:
                        logger.error(f"Supabase get_datasets failed ({r.status_code}): {r.text}")
                        raise RuntimeError(f"Supabase error ({r.status_code}): {r.text}")
            except Exception as e:
                logger.error(f"Error reading datasets from Supabase: {e}")
                raise

        return list(self._local_db["datasets"].values())

    def save_dataset(self, dataset: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in dataset or not dataset["id"]:
            dataset["id"] = str(uuid.uuid4())
        if "created_at" not in dataset:
            dataset["created_at"] = datetime.now(timezone.utc).isoformat()

        if self.use_supabase:
            filtered_payload = _filter_payload(dataset, DATASET_COLUMNS)
            try:
                headers = self._get_headers()
                headers["Prefer"] = "resolution=merge-duplicates,return=representation"
                url = f"{self.supabase_url}/rest/v1/datasets"
                with httpx.Client(timeout=10.0) as client:
                    r = client.post(url, json=filtered_payload, headers=headers)
                    if r.status_code in (200, 201, 204):
                        res_data = r.json() if r.status_code in (200, 201) else [filtered_payload]
                        return res_data[0] if res_data else filtered_payload
                    else:
                        logger.error(f"Supabase save_dataset failed ({r.status_code}): {r.text}")
                        raise RuntimeError(f"Supabase error ({r.status_code}): {r.text}")
            except Exception as e:
                logger.error(f"Error saving dataset to Supabase: {e}")
                raise

        self._local_db["datasets"][dataset["slug"]] = dataset
        return dataset

    def get_dataset_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        if self.use_supabase:
            try:
                url = f"{self.supabase_url}/rest/v1/datasets?slug=eq.{slug}&select=*"
                with httpx.Client(timeout=10.0) as client:
                    r = client.get(url, headers=self._get_headers())
                    if r.status_code == 200:
                        data = r.json()
                        return data[0] if data and len(data) > 0 else None
                    else:
                        logger.error(f"Supabase get_dataset_by_slug failed ({r.status_code}): {r.text}")
                        raise RuntimeError(f"Supabase error ({r.status_code}): {r.text}")
            except Exception as e:
                logger.error(f"Error fetching dataset {slug} from Supabase: {e}")
                raise

        return self._local_db["datasets"].get(slug)

    def save_experiment(self, exp_data: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in exp_data or not exp_data["id"]:
            exp_data["id"] = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        exp_data["created_at"] = exp_data.get("created_at", now)
        exp_data["updated_at"] = now

        if self.use_supabase:
            filtered_payload = _filter_payload(exp_data, EXPERIMENT_COLUMNS)
            try:
                url = f"{self.supabase_url}/rest/v1/experiments"
                with httpx.Client(timeout=10.0) as client:
                    r = client.post(url, json=filtered_payload, headers=self._get_headers())
                    if r.status_code in (200, 201, 204):
                        res_data = r.json() if r.status_code in (200, 201) else [filtered_payload]
                        return res_data[0] if res_data else filtered_payload
                    else:
                        logger.error(f"Supabase save_experiment failed ({r.status_code}): {r.text}")
                        raise RuntimeError(f"Supabase error ({r.status_code}): {r.text}")
            except Exception as e:
                logger.error(f"Error saving experiment to Supabase: {e}")
                raise

        self._local_db["experiments"][exp_data["id"]] = exp_data
        return exp_data

    def get_experiment(self, exp_id: str) -> Optional[Dict[str, Any]]:
        if self.use_supabase:
            try:
                url = f"{self.supabase_url}/rest/v1/experiments?id=eq.{exp_id}&select=*"
                with httpx.Client(timeout=10.0) as client:
                    r = client.get(url, headers=self._get_headers())
                    if r.status_code == 200:
                        data = r.json()
                        return data[0] if data and len(data) > 0 else None
                    else:
                        logger.error(f"Supabase get_experiment failed ({r.status_code}): {r.text}")
                        raise RuntimeError(f"Supabase error ({r.status_code}): {r.text}")
            except Exception as e:
                logger.error(f"Error fetching experiment {exp_id} from Supabase: {e}")
                raise

        return self._local_db["experiments"].get(exp_id)

    def save_experiment_run(self, run_data: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in run_data or not run_data["id"]:
            run_data["id"] = str(uuid.uuid4())
        run_data["created_at"] = datetime.now(timezone.utc).isoformat()

        if self.use_supabase:
            filtered_payload = _filter_payload(run_data, EXPERIMENT_RUN_COLUMNS)
            try:
                url = f"{self.supabase_url}/rest/v1/experiment_runs"
                with httpx.Client(timeout=10.0) as client:
                    r = client.post(url, json=filtered_payload, headers=self._get_headers())
                    if r.status_code in (200, 201, 204):
                        res_data = r.json() if r.status_code in (200, 201) else [filtered_payload]
                        return res_data[0] if res_data else filtered_payload
                    else:
                        logger.error(f"Supabase save_experiment_run failed ({r.status_code}): {r.text}")
                        raise RuntimeError(f"Supabase error ({r.status_code}): {r.text}")
            except Exception as e:
                logger.error(f"Error saving experiment run to Supabase: {e}")
                raise

        self._local_db["experiment_runs"][run_data["id"]] = run_data
        return run_data

    def get_experiment_runs(self, experiment_id: str) -> List[Dict[str, Any]]:
        if self.use_supabase:
            try:
                url = f"{self.supabase_url}/rest/v1/experiment_runs?experiment_id=eq.{experiment_id}&select=*"
                with httpx.Client(timeout=10.0) as client:
                    r = client.get(url, headers=self._get_headers())
                    if r.status_code == 200:
                        return r.json()
                    else:
                        logger.error(f"Supabase get_experiment_runs failed ({r.status_code}): {r.text}")
                        raise RuntimeError(f"Supabase error ({r.status_code}): {r.text}")
            except Exception as e:
                logger.error(f"Error fetching runs for experiment {experiment_id} from Supabase: {e}")
                raise

        return [r for r in self._local_db["experiment_runs"].values() if r.get("experiment_id") == experiment_id]

    def get_history(self, session_id: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        if self.use_supabase:
            try:
                filter_clause = f"&session_id=eq.{session_id}" if session_id else ""
                url = f"{self.supabase_url}/rest/v1/experiments?select=*,experiment_runs(*){filter_clause}&order=created_at.desc&limit={limit}"
                with httpx.Client(timeout=10.0) as client:
                    r = client.get(url, headers=self._get_headers())
                    if r.status_code == 200:
                        return r.json()
                    else:
                        logger.error(f"Supabase get_history failed ({r.status_code}): {r.text}")
                        raise RuntimeError(f"Supabase error ({r.status_code}): {r.text}")
            except Exception as e:
                logger.error(f"Error fetching history from Supabase: {e}")
                raise

        exps = list(self._local_db["experiments"].values())
        if session_id:
            exps = [e for e in exps if e.get("session_id") == session_id]
        exps = sorted(exps, key=lambda x: x.get("created_at", ""), reverse=True)[:limit]
        for exp in exps:
            exp["experiment_runs"] = self.get_experiment_runs(exp["id"])
        return exps

    def save_comparison(self, comp_data: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in comp_data or not comp_data["id"]:
            comp_data["id"] = str(uuid.uuid4())
        comp_data["created_at"] = datetime.now(timezone.utc).isoformat()

        if self.use_supabase:
            filtered_payload = _filter_payload(comp_data, ALGORITHM_COMPARISON_COLUMNS)
            try:
                url = f"{self.supabase_url}/rest/v1/algorithm_comparisons"
                with httpx.Client(timeout=10.0) as client:
                    r = client.post(url, json=filtered_payload, headers=self._get_headers())
                    if r.status_code in (200, 201, 204):
                        res_data = r.json() if r.status_code in (200, 201) else [filtered_payload]
                        return res_data[0] if res_data else filtered_payload
                    else:
                        logger.error(f"Supabase save_comparison failed ({r.status_code}): {r.text}")
                        raise RuntimeError(f"Supabase error ({r.status_code}): {r.text}")
            except Exception as e:
                logger.error(f"Error saving comparison to Supabase: {e}")
                raise

        self._local_db["algorithm_comparisons"][comp_data["id"]] = comp_data
        return comp_data

db_client = DatabaseClient()
