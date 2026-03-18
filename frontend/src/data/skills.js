export const skillCategories = [
  {
    id: "aiml",
    label: "AI / ML",
    skills: [
      { name: "Machine Learning", level: 85, orbit: "core" },
      { name: "Deep Learning", level: 75, orbit: "core" },
      { name: "Computer Vision", level: 80, orbit: "core" },
      { name: "NLP", level: 75, orbit: "core" },
      { name: "RAG Pipelines", level: 85, orbit: "core" },
      { name: "Edge AI", level: 80, orbit: "core" },
      { name: "LLMs (Gemma, Gemini)", level: 78, orbit: "secondary" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Python", level: 90, orbit: "core" },
      { name: "FastAPI", level: 80, orbit: "core" },
      { name: "Java", level: 65, orbit: "secondary" },
      { name: "C", level: 60, orbit: "secondary" },
      { name: "Microservices", level: 80, orbit: "core" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    skills: [
      { name: "Google Cloud (GCP)", level: 80, orbit: "core" },
      { name: "Docker", level: 75, orbit: "core" },
      { name: "GitHub Actions", level: 75, orbit: "secondary" },
      { name: "CI/CD", level: 75, orbit: "secondary" },
      { name: "AWS", level: 70, orbit: "secondary" },
      { name: "Vercel", level: 70, orbit: "emerging" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "HTML", level: 80, orbit: "secondary" },
      { name: "CSS", level: 75, orbit: "secondary" },
      { name: "JavaScript", level: 75, orbit: "secondary" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Databases",
    skills: [
      { name: "MongoDB", level: 85, orbit: "core" },
      { name: "MySQL", level: 75, orbit: "secondary" },
      { name: "Vector Databases", level: 80, orbit: "core" },
      { name: "Git", level: 80, orbit: "core" },
      { name: "IBM Watson", level: 65, orbit: "emerging" },
    ],
  },
];

export const techRadar = [
  { name: "Edge AI / On-device LLMs", quadrant: "adopt" },
  { name: "Agentic RAG", quadrant: "adopt" },
  { name: "Microservices on GCP", quadrant: "adopt" },
  { name: "MongoDB Atlas Vector Search", quadrant: "adopt" },
  { name: "Computer Vision Pipelines", quadrant: "trial" },
  { name: "Knowledge Graphs", quadrant: "trial" },
  { name: "React + Three.js", quadrant: "trial" },
  { name: "Kubernetes", quadrant: "assess" },
  { name: "MLOps / Model Registry", quadrant: "assess" },
  { name: "Terraform / IaC", quadrant: "hold" },
];
