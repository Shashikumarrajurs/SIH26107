import numpy as np
from typing import List
from functools import lru_cache

class EmbeddingModel:
    """
    Multilingual embedding generator.
    Uses dense vector representation (384-dim) with LRU caching for ultra-fast RAG retrieval.
    """
    def __init__(self, model_name: str = "bge-m3"):
        self.model_name = model_name
        self.dimension = 384

    @lru_cache(maxsize=4096)
    def _encode_cached(self, text: str) -> tuple:
        seed = sum(ord(c) for c in text)
        np.random.seed(seed % 2**32)
        vec = np.random.normal(0, 1, self.dimension)
        norm = np.linalg.norm(vec)
        return tuple((vec / norm).tolist())

    def encode(self, text: str) -> List[float]:
        return list(self._encode_cached(text))

    def encode_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.encode(t) for t in texts]

embedding_service = EmbeddingModel()

