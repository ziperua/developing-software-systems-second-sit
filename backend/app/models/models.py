from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from app.database import Base
import uuid
from datetime import datetime

class ApplicationUser(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class WatchlistItem(Base):
    __tablename__ = "movie"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    director = Column(String, nullable=True)
    release_year = Column(Integer, nullable=True)
    genre = Column(String, nullable=True)
    status = Column(String, nullable=False)
    rating = Column(Integer, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class CommunityMovie(Base):
    __tablename__ = "community_movie"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_by_user_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_by_display_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    director = Column(String, nullable=True)
    release_year = Column(Integer, nullable=True)
    genre = Column(String, nullable=True)
    average_community_rating = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)