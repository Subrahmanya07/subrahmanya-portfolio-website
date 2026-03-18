import os
import yaml
import httpx
from pathlib import Path
from api.services.mongodb_service import vector_search

GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta"
PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


# ---------------------------------------------------------------------------
# Load all prompts from YAML at module level (once, not per-request)
# ---------------------------------------------------------------------------
def _load_yaml(filename: str) -> dict:
    with open(PROMPTS_DIR / filename, "r") as f:
        return yaml.safe_load(f)


_ira = _load_yaml("ira_system.yaml")
_classifier = _load_yaml("intent_classifier.yaml")
_hacker = _load_yaml("prompt_hacker.yaml")
_responses = _load_yaml("responses.yaml")

# Pre-build prompt hacker system prompt with secret injected
_hacker_system = _hacker["system_prompt"].format(secret=_hacker["secret"])

# Build greeting patterns set
_greeting_patterns = set(_responses["greeting"]["patterns"])
_short_greet_words = set(_responses["greeting"]["short_greet_words"])


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

Education: BE in AI & ML from VCET Puttur (CGPA: 8.83/10, 2021-2025).
Pre-University from Trisha Pre-University College, Udupi (82.33%, 2019-2021).

Projects:
- KALPA: AI humanoid for areca/coconut plantations, 25% efficiency improvement, seed funding of 1 lakh under PROJECT CODE UNNATI.
- SimplyReview: AI literature review tool with semantic search and knowledge graphs.
- LexiGuid: Educational AI with RAG pipelines for student query resolution.
- Enhanced UX Using Indirect Cues: Context-aware personalization.

Skills: Python, C, Java, Machine Learning, Deep Learning, RAG Pipelines, Edge AI, Computer Vision, NLP, LLMs (Gemma, Gemini), FastAPI, Flask, Microservices, MongoDB, MySQL, Vector Databases, GCP, Docker, GitHub Actions, CI/CD, HTML, CSS, JavaScript, Git.

Certifications: Life Skills 2.0 (Wadhwani Foundation), Cognitive Customer Insights with Watson AI (IBM), Python Basics (Coursera), AI Youth Program (Intel).

Activities: IEEE Member (participated in PRIMED Internship by IEEE Mangalore), CoRE Club member at VCET (organized "Unbounded" technical event).

Achievements: Received seed funding of 1,00,000 INR for project KALPA under PROJECT CODE UNNATI.

Contact: subrahmanyashegde2413@gmail.com
GitHub: https://github.com/Subrahmanya07
LinkedIn: https://linkedin.com/in/subrahmanya-shivaram-hegde-3aab21255
Location: Bengaluru, Karnataka, India
"""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _is_greeting(text: str) -> bool:
    """Check if the message is a simple greeting."""
    cleaned = text.lower().strip().rstrip("!?.,'\"")
    if cleaned in _greeting_patterns:
        return True
    words = cleaned.split()
    if len(words) <= 3 and words[0] in _short_greet_words:
        return True
    return False


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


async def _classify_intent(api_key: str, question: str) -> str:
    """Classify user intent using the intent classifier prompt."""
    prompt = _classifier["prompt"].format(question=question)
    try:
        result = await _generate(api_key, prompt)
        category = result.strip().lower().replace('"', '').replace("'", "")
        for valid in _classifier["categories"]:
            if valid in category:
                return valid
        return _classifier["default_category"]
    except Exception:
        return _classifier["default_category"]


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------
async def get_rag_response(
    question: str,
    mode: str | None = None,
) -> str:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return _fallback_response(question)

    # --- Prompt Hacker mode ---
    if mode == "prompt_hacker":
        prompt = _hacker["prompt_template"].format(
            system_prompt=_hacker_system,
            question=question,
        )
        try:
            return await _generate(api_key, prompt)
        except Exception:
            return _hacker["error_response"]

    # --- Normal chat mode ---

    # Step 1: Quick greeting check (no API call)
    if _is_greeting(question):
        return _responses["greeting"]["message"]

    # Step 2: Classify intent via Gemini
    intent = await _classify_intent(api_key, question)

    if intent == "greeting":
        return _responses["greeting"]["message"]

    if intent == "off_topic":
        return _responses["off_topic"]["message"]

    # Step 3: RAG — retrieve context from vector DB
    context = FALLBACK_CONTEXT
    try:
        embedding = await _embed(api_key, question)
        chunks = await vector_search(embedding, limit=3)
        if chunks:
            context = "\n\n".join([c["text"] for c in chunks])
    except Exception:
        pass  # Use fallback context

    # Step 4: Generate response with RAG template
    prompt = _ira["rag_template"].format(
        system_prompt=_ira["prompt"],
        context=context,
        question=question,
    )

    try:
        return await _generate(api_key, prompt)
    except Exception:
        return _fallback_response(question)


def _fallback_response(question: str) -> str:
    """Last-resort fallback when both Gemini API and vector DB are unavailable."""
    q = question.lower()

    if _is_greeting(q):
        return _responses["greeting"]["message"]

    # Check each fallback category
    for _key, entry in _responses["fallback"].items():
        if any(w in q for w in entry["keywords"]):
            return entry["response"]

    return _responses["off_topic"]["message"]
