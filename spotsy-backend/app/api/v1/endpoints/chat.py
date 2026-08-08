from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import process_chat_query

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_recommendations_endpoint(request: ChatRequest):
    """Process user prompt using AI Orchestration and return place recommendations."""
    return await process_chat_query(
        prompt=request.prompt,
        lat=request.latitude,
        lng=request.longitude,
        session_id=request.session_id
    )
