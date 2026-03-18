from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from api.services.mongodb_service import save_contact
from api.services.email_service import send_notification

router = APIRouter()


class ContactRequest(BaseModel):
    name: str
    email: str
    subject: str = "General"
    message: str


class ContactResponse(BaseModel):
    success: bool
    message: str


@router.post("/contact", response_model=ContactResponse)
async def submit_contact(request: ContactRequest):
    try:
        await save_contact(request.model_dump())

        try:
            await send_notification(request.model_dump())
        except Exception:
            pass  # Don't fail if email fails

        return ContactResponse(success=True, message="Message received! I'll get back to you soon.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
