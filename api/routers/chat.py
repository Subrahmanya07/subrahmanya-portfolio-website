from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.services.rag_service import get_rag_response

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    system_prompt: str | None = None
    mode: str | None = None


class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = await get_rag_response(
            question=request.message,
            system_prompt=request.system_prompt,
            mode=request.mode,
        )
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
