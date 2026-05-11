from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CreateWatchlistItemDto(BaseModel):
    title: str
    director: Optional[str] = None
    release_year: Optional[int] = None
    genre: Optional[str] = None
    status: str
    rating: Optional[int] = None
    notes: Optional[str] = None

class UpdateWatchlistItem(BaseModel):
    title: str
    director: Optional[str] = None
    release_year: Optional[int] = None
    genre: Optional[str] = None
    status: str
    rating: Optional[int] = None
    notes: Optional[str] = None

class WatchlistItemResponseDto(BaseModel):
    id: str
    title: str
    director: Optional[str] = None
    release_year: Optional[int] = None
    genre: Optional[str] = None
    status: str
    rating: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime