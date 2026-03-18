import os
import httpx
from api.services.mongodb_service import vector_search

GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta"

# Fallback knowledge base when RAG DB is empty or unavailable
FALLBACK_CONTEXT = """
Subrahmanya Shivaram Hegde is a Junior Edge AI Engineer at Kruthak, Bengaluru.
He builds Agentic RAG SaaS on GCP, works with Microservices and Computer Vision.

Experience:
- Junior Edge AI Engineer at Kruthak (Jan 2026 - Present): Microservices, Agentic RAG, Edge AI (Gemma), DevOps on GCP.
- Software Engineering Trainee at Kruthak (Jul 2025 - Dec 2025): Educational AI, LexiGuid MVP, RAG pipelines, GCP.
- AI/ML Engineer at Rooman Technologies (Sep 2024 - Feb 2025): Watson AI, customer insights, IBM mentorship.
- ML Intern at Elewyate (Jun 2024 - Jul 2024): Classification project.
- MongoDB Intern at Q-Spiders (Oct 2023 - Nov 2023): Full-stack Member Tracking System.

Education: BE in AI & ML from VCET Puttur (CGPA: 8.83/10).

Projects:
- KALPA: AI humanoid for areca/coconut plantations, 25% efficiency improvement, ₹1L seed funding.
- SimplyReview: AI literature review tool with semantic search and knowledge graphs.
- LexiGuid: Educational AI with RAG pipelines.
- Enhanced UX Using Indirect Cues: Context-aware personalization.

Skills: Python, Machine Learning, Deep Learning, RAG, Edge AI, Computer Vision, GCP, Docker, MongoDB, FastAPI, Microservices.
Certifications: Python Basics, ML, AI Youth Program (Intel), Life Skills (Wadhwani).
"""

SYSTEM_PROMPT = """You are an AI assistant for Subrahmanya Shivaram Hegde's portfolio website.
Answer questions about his skills, experience, projects, and education using the provided context.
Be helpful, concise, and professional. If you don't have specific information, say so honestly.
Always respond in a friendly, professional tone. Use markdown formatting when appropriate."""


async def _embed(api_key: str, text: str) -> list[float]:
    """Get embedding via Gemini REST API."""
    url = f"{GEMINI_BASE}/models/gemini-embedding-001:embedContent?key={api_key}"
    payload = {"content": {"parts": [{"text": text}]}}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        return resp.json()["embedding"]["values"]


async def _generate(api_key: str, prompt: str) -> str:
    """Generate text via Gemini REST API."""
    url = f"{GEMINI_BASE}/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]


async def get_rag_response(
    question: str,
    system_prompt: str | None = None,
    mode: str | None = None,
) -> str:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return _fallback_response(question)

    # Try to get relevant context from vector search
    context = FALLBACK_CONTEXT
    try:
        embedding = await _embed(api_key, question)
        chunks = await vector_search(embedding, limit=3)
        if chunks:
            context = "\n\n".join([c["text"] for c in chunks])
    except Exception:
        pass  # Use fallback context

    # Build prompt
    sys = system_prompt or SYSTEM_PROMPT
    prompt = f"""{sys}

Context about Subrahmanya:
{context}

User question: {question}

Provide a helpful, accurate response based on the context above."""

    try:
        return await _generate(api_key, prompt)
    except Exception:
        return _fallback_response(question)


def _fallback_response(question: str) -> str:
    q = question.lower()
    if any(w in q for w in ["skill", "tech", "stack", "know"]):
        return "Subrahmanya is skilled in **Python, Machine Learning, Deep Learning, RAG pipelines, Edge AI, Computer Vision, GCP, Docker, MongoDB, FastAPI, and Microservices**. He's currently focused on optimizing on-device LLMs and building Agentic RAG systems."
    elif any(w in q for w in ["experience", "work", "job", "role"]):
        return "Subrahmanya is currently a **Junior Edge AI Engineer at Kruthak** (Jan 2026 – Present) in Bengaluru, where he works on microservices, Agentic RAG, and Edge AI. Previously, he was a Software Engineering Trainee at Kruthak, and interned at Rooman Technologies (IBM Watson AI), Elewyate (ML), and Q-Spiders (MongoDB)."
    elif any(w in q for w in ["project", "build", "built"]):
        return "Key projects include **KALPA** (AI for plantation management, ₹1L funded), **SimplyReview** (AI literature review tool), **LexiGuid** (Educational AI with RAG), and **Enhanced UX Using Indirect Cues**."
    elif any(w in q for w in ["education", "degree", "college", "university"]):
        return "Subrahmanya holds a **BE in Artificial Intelligence & Machine Learning** from Vivekananda College of Engineering & Technology, Puttur (CGPA: 8.83/10, 2021–2025)."
    elif any(w in q for w in ["contact", "email", "reach", "hire"]):
        return "You can reach Subrahmanya at **subrahmanyashegde2413@gmail.com** or connect on [LinkedIn](https://linkedin.com/in/subrahmanya-shivaram-hegde-3aab21255). He's open to Edge AI, MLOps, and Agentic Systems roles."
    else:
        return "Subrahmanya Shivaram Hegde is a **Junior Edge AI Engineer** at Kruthak, Bengaluru. He specializes in Agentic RAG, Edge AI, Computer Vision, and Microservices on GCP. Feel free to ask me about his skills, projects, or experience!"
