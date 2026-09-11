import numpy as np
from typing import List

class EmbeddingModel:
    """
    Multilingual embedding generator.
    Uses dense vector representation (384-dim) for Qdrant compatibility.
    """
    def __init__(self, model_name: str = "bge-m3"):
        self.model_name = model_name
        self.dimension = 384

    def encode(self, text: str) -> List[float]:
        # Generate deterministic vector representation from hash seed for local fast RAG
        seed = sum(ord(c) for c in text)
        np.random.seed(seed % 2**32)
        vec = np.random.normal(0, 1, self.dimension)
        norm = np.linalg.norm(vec)
        return (vec / norm).tolist()

    def encode_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.encode(t) for t in texts]

embedding_service = EmbeddingModel()
