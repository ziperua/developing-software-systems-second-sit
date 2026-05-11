from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class CreateWatchlistItemDto(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    director: Optional[str] = Field(default=None, max_length=80)
    release_year: Optional[int] = Field(default=None, ge=1888, le=2028)
    genre: Optional[str] = Field(default=None, max_length=40)
    status: Literal["PlanToWatch", "Watching", "Watched", "Dropped"]
    rating: Optional[int] = Field(default=None, ge=1, le=10)
    notes: Optional[str] = Field(default=None, max_length=1000)

class UpdateWatchlistItemDto(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    director: Optional[str] = Field(default=None, max_length=80)
    release_year: Optional[int] = Field(default=None, ge=1888, le=2028)
    genre: Optional[str] = Field(default=None, max_length=40)
    status: Literal["PlanToWatch", "Watching", "Watched", "Dropped"]
    rating: Optional[int] = Field(default=None, ge=1, le=10)
    notes: Optional[str] = Field(default=None, max_length=1000)

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