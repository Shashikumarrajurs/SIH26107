const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function sendMessage(
  message: string,
  conversationId?: string,
  language: string = "en",
  userContext?: any,
  persona: string = "consumer"
) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversation_id: conversationId,
      message,
      language,
      persona,
      user_context: userContext
    })
  });
  if (!res.ok) throw new Error("Failed to post chat message");
  return res.json();
}

export async function getSemanticChanges() {
  const res = await fetch(`${API_BASE}/changes/latest`);
  if (!res.ok) throw new Error("Failed to fetch semantic changes");
  return res.json();
}

export async function getJudgeDemo(demoId: number) {
  const res = await fetch(`${API_BASE}/changes/demo/${demoId}`);
  if (!res.ok) throw new Error(`Failed to fetch demo ${demoId}`);
  return res.json();
}

export async function getBISGlossary(lang: string = "en") {
  const res = await fetch(`${API_BASE}/changes/glossary?lang=${encodeURIComponent(lang)}`);
  if (!res.ok) throw new Error("Failed to fetch BIS glossary");
  return res.json();
}

export async function getBISProcessSteps(lang: string = "en") {
  const res = await fetch(`${API_BASE}/changes/process/steps?lang=${encodeURIComponent(lang)}`);
  if (!res.ok) throw new Error("Failed to fetch BIS process steps");
  return res.json();
}

export async function recommendStandards(productDescription: string) {
  const res = await fetch(`${API_BASE}/standards/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_description: productDescription })
  });
  if (!res.ok) throw new Error("Failed to recommend standards");
  return res.json();
}

export async function compareStandards(std1: string, std2: string) {
  const res = await fetch(`${API_BASE}/standards/compare?std1=${encodeURIComponent(std1)}&std2=${encodeURIComponent(std2)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to compare standards");
  }
  return res.json();
}

export async function getStandardsList() {
  const res = await fetch(`${API_BASE}/standards`);
  if (!res.ok) throw new Error("Failed to fetch standards");
  return res.json();
}

export async function getStandardDetail(id: string) {
  const res = await fetch(`${API_BASE}/standards/${id}`);
  if (!res.ok) throw new Error("Failed to fetch standard detail");
  return res.json();
}

export async function getCertificationGuide() {
  const res = await fetch(`${API_BASE}/certification/guide`);
  if (!res.ok) throw new Error("Failed to fetch certification guide");
  return res.json();
}

export async function analyzeCertification(product: string) {
  const res = await fetch(`${API_BASE}/certification/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product })
  });
  if (!res.ok) throw new Error("Failed to analyze certification");
  return res.json();
}

export async function analyzeTesting(product: string, standard?: string) {
  const res = await fetch(`${API_BASE}/testing/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product, standard })
  });
  if (!res.ok) throw new Error("Failed to analyze testing");
  return res.json();
}

export async function searchLaboratories(location?: string, product?: string) {
  const res = await fetch(`${API_BASE}/laboratories/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location, product })
  });
  if (!res.ok) throw new Error("Failed to search laboratories");
  return res.json();
}

export async function queryHallmarking(query: string) {
  const res = await fetch(`${API_BASE}/hallmarking/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error("Failed to query hallmarking");
  return res.json();
}

export async function queryConsumer(query: string) {
  const res = await fetch(`${API_BASE}/consumer/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error("Failed to query consumer");
  return res.json();
}

export async function getAdminDocuments() {
  const res = await fetch(`${API_BASE}/admin/documents`);
  if (!res.ok) throw new Error("Failed to fetch admin documents");
  return res.json();
}

export async function getEvaluationMetrics() {
  const res = await fetch(`${API_BASE}/admin/evaluation/metrics`);
  if (!res.ok) throw new Error("Failed to fetch evaluation metrics");
  return res.json();
}

export async function getKnowledgeFreshness() {
  const res = await fetch(`${API_BASE}/admin/freshness`);
  if (!res.ok) throw new Error("Failed to fetch knowledge freshness");
  return res.json();
}
