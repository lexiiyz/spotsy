from fastapi import APIRouter
from app.api.v1.endpoints import busyness, places, traffic, chat

api_router = APIRouter()

api_router.include_router(busyness.router, tags=["busyness"])
api_router.include_router(places.router, tags=["places"])
api_router.include_router(traffic.router, tags=["traffic"])
api_router.include_router(chat.router, tags=["chat"])
