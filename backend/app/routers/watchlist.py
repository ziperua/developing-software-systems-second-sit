from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import WatchlistItem
from app.schemas.watchlist import CreateWatchlistItemDto, UpdateWatchlistItem, WatchlistItemResponseDto
from app.routers.auth import get_current_user
from app.models.models import ApplicationUser
from datetime import datetime
from fastapi import Response

router = APIRouter(prefix="/api/watchlist", tags=["watchlist"])

#get items
@router.get("")
def getWatchlistItems(current_user: ApplicationUser = Depends(get_current_user),
    db: Session = Depends(get_db)):
    
    #get items in a list
    items=db.query(WatchlistItem).filter(WatchlistItem.user_id == current_user.id).all()

    return [WatchlistItemResponseDto(
        id= item.id,
        title= item.title,
        director= item.director,
        release_year= item.release_year,
        genre= item.genre,
        status= item.status,
        rating= item.rating,
        notes= item.notes,
        created_at= item.created_at,
        updated_at= item.updated_at,
    ) for item in items]

#create item
@router.post("")
def createWatchistItem(data: CreateWatchlistItemDto,
    current_user: ApplicationUser = Depends(get_current_user),
    db: Session = Depends(get_db)):

    item = WatchlistItem(
        user_id=current_user.id,
        title= data.title,
        director= data.director,
        release_year= data.release_year,
        genre= data.genre,
        status= data.status,
        rating= data.rating,
        notes= data.notes,
        created_at= datetime.utcnow(),
        updated_at= datetime.utcnow()
    )

    #save item
    db.add(item)
    db.commit()
    db.refresh(item)

    return WatchlistItemResponseDto(
        id=item.id,
        title=item.title,
        director = item.director,
        release_year = item.release_year,
        genre = item.genre,
        status= item.status,
        rating = item.rating,
        notes = item.notes,
        created_at = item.created_at,
        updated_at = item.updated_at
    )

@router.get("/{item_id}")
def getWatchlistItem(item_id: str,
    current_user: ApplicationUser = Depends(get_current_user),
    db: Session = Depends(get_db)):

    item = db.query(WatchlistItem).filter(WatchlistItem.id == item_id).first()

    #security and check is item exists
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your item")
    
    return WatchlistItemResponseDto(
        id=item.id,
        title=item.title,
        director = item.director,
        release_year = item.release_year,
        genre = item.genre,
        status= item.status,
        rating = item.rating,
        notes = item.notes,
        created_at = item.created_at,
        updated_at = item.updated_at
    )

#update item
@router.put("/{item_id}")
def updateWatchlistItem(data: UpdateWatchlistItem,
    item_id : str,
    current_user: ApplicationUser = Depends(get_current_user),
    db: Session = Depends(get_db)):

    item = db.query(WatchlistItem).filter(WatchlistItem.id ==item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item nor found")
    if item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your item")

    #update
    item.title= data.title
    item.director= data.director
    item.release_year= data.release_year
    item.genre= data.genre
    item.status= data.status
    item.rating= data.rating
    item.notes= data.notes
    item.updated_at= datetime.utcnow()
    
    db.commit()
    db.refresh(item)

    return WatchlistItemResponseDto(
        id=item.id,
        title=item.title,
        director=item.director,
        release_year=item.release_year,
        genre=item.genre,
        status=item.status,
        rating=item.rating,
        notes=item.notes,
        created_at=item.created_at,
        updated_at=item.updated_at
    )

#delete item
@router.delete("/{item_id}")
def deleteWatchlistItem(item_id: str,
    current_user: ApplicationUser = Depends(get_current_user),
    db: Session = Depends(get_db)):

    item = db.query(WatchlistItem).filter(WatchlistItem.id == item_id).first()

    if not item :
        raise HTTPException(status_code= 404, detail="Item not found")
    if item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your item")

    db.delete(item)
    db.commit()

    return Response(status_code=204)