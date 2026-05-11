from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class CreateCommunityMovieDto(BaseModel):
    title: str
    director: Optional[str] = None
    release_year: Optional[int] = None
    genre: Optional[str] = None
    description: Optional[str] = None

class UpdateCommunityMovieDto(BaseModel):
    title: str
    director: Optional[str] = None
    release_year: Optional[int] = None
    genre: Optional[str] = None
    description: Optional[str] = None

class CommunityMovieResponseDto(BaseModel):
    id: str
    title: str
    director: Optional[str] = None
    release_year: Optional[int] = None
    genre: Optional[str] = None
    description: Optional[str] = None
    created_by_user_id: str
    created_by_display_name: str
    created_at: datetime
    updated_at: datetime