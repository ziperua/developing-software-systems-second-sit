from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field

class CreateCommunityMovieDto(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    director: Optional[str] = Field(default=None, max_length=80)
    release_year: Optional[int] = Field(default=None, ge=1888, le=2028)
    genre: Optional[str] = Field(default=None, max_length=40)
    description: Optional[str] = Field(default=None, max_length=1500)

class UpdateCommunityMovieDto(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    director: Optional[str] = Field(default=None, max_length=80)
    release_year: Optional[int] = Field(default=None, ge=1888, le=2028)
    genre: Optional[str] = Field(default=None, max_length=40)
    description: Optional[str] = Field(default=None, max_length=1500)

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