from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import CommunityMovie
from app.schemas.community import CreateCommunityMovieDto, UpdateCommunityMovieDto, CommunityMovieResponseDto
from app.routers.auth import get_current_user
from app.models.models import ApplicationUser
from datetime import datetime
from fastapi import Response

router = APIRouter(prefix="/api/community-movies", tags=["community"])

#get items
@router.get("")
def getCommunityMovies(db: Session = Depends(get_db)):
    #getting items
    items = db.query(CommunityMovie).all()

    return [CommunityMovieResponseDto(
        id = item.id,
        title=item.title,
        director=item.director,
        release_year=item.release_year,
        genre=item.genre,
        description=item.description,
        created_by_user_id=item.created_by_user_id,
        created_by_display_name=item.created_by_display_name,
        created_at=item.created_at,
        updated_at=item.updated_at
    )for item in items]

#get item
@router.get("/{item_id}")
def getCommunityMovies(item_id: str, db: Session= Depends(get_db)):
    item = db.query(CommunityMovie).filter(CommunityMovie.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return CommunityMovieResponseDto(
        id = item.id,
        title=item.title,
        director=item.director,
        release_year=item.release_year,
        genre=item.genre,
        description=item.description,
        created_by_user_id=item.created_by_user_id,
        created_by_display_name=item.created_by_display_name,
        created_at=item.created_at,
        updated_at=item.updated_at
    )

#post item
@router.post("")
def postCommunityMovie(data: CreateCommunityMovieDto,
    current_user: ApplicationUser = Depends(get_current_user),
    db: Session = Depends(get_db)):

    item = CommunityMovie(

        title = data.title,
        director = data.director,
        release_year = data.release_year,
        genre = data.genre,
        description = data.description,
        created_by_user_id=current_user.id,
        created_by_display_name=current_user.display_name,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return CommunityMovieResponseDto(
        id = item.id,
        title=item.title,
        director=item.director,
        release_year=item.release_year,
        genre=item.genre,
        description=item.description,
        created_by_user_id=item.created_by_user_id,
        created_by_display_name=item.created_by_display_name,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

#put item
@router.put("/{item_id}")
def putCommunityMovie(data: UpdateCommunityMovieDto,
    item_id: str, db: Session = Depends(get_db),
    current_user: ApplicationUser = Depends(get_current_user)):

    item = db.query(CommunityMovie).filter(CommunityMovie.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.created_by_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your item")
    
    item.title=data.title
    item.director=data.director
    item.release_year=data.release_year
    item.genre=data.genre
    item.description=data.description
    item.updated_at=datetime.utcnow()

    db.commit()
    db.refresh(item)

    return CommunityMovieResponseDto(
        id = item.id,
        title=item.title,
        director=item.director,
        release_year=item.release_year,
        genre=item.genre,
        description=item.description,
        created_by_user_id=current_user.id,
        created_by_display_name=current_user.display_name,
        created_at=item.created_at,
        updated_at=item.updated_at
    )

#delete item
@router.delete("/{item_id}")
def deleteCommunityMovie(item_id: str, db: Session = Depends(get_db),
    current_user: (ApplicationUser) = Depends(get_current_user)):

    item = db.query(CommunityMovie).filter(CommunityMovie.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if current_user.id != item.created_by_user_id:
        raise HTTPException(status_code=403, detail="Not your item")
    
    db.delete(item)
    db.commit()

    return Response(status_code=204)