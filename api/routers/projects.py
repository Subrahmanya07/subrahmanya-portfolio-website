from fastapi import APIRouter
import json
import os

router = APIRouter()

PROJECTS = [
    {
        "id": 1,
        "title": "KALPA",
        "subtitle": "Areca/Coconut Plantation Management System",
        "description": "An AI humanoid system for Areca and Coconut plantations that improved efficiency by 25%.",
        "status": "Active",
        "period": "December 2023 - Present",
        "tech": ["Python", "AI/ML", "Computer Vision", "IoT", "Robotics"],
        "category": "vision",
        "github": "https://github.com/Subrahmanya07",
    },
    {
        "id": 2,
        "title": "SimplyReview",
        "subtitle": "Literature Review Made Easy",
        "description": "An AI tool that simplifies literature reviews by extracting key concepts and relationships.",
        "status": "Completed",
        "period": "February 2025 - May 2025",
        "tech": ["Python", "NLP", "RAG", "Knowledge Graphs", "Semantic Search"],
        "category": "rag",
        "github": "https://github.com/Subrahmanya07",
    },
    {
        "id": 3,
        "title": "LexiGuid",
        "subtitle": "Educational AI Assistant",
        "description": "MVP of an educational AI application with RAG pipelines for student query resolution.",
        "status": "In Development",
        "period": "July 2025 - Present",
        "tech": ["Python", "RAG", "GCP", "Vector DB", "LLMs"],
        "category": "rag",
        "github": "https://github.com/Subrahmanya07",
    },
]


@router.get("/projects")
async def get_projects():
    return {"projects": PROJECTS}
