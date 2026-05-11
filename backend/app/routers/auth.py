from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import ApplicationUser
from app.schemas.auth import RegisterRequestDto, LoginRequestDto, AuthResponse, UserResponseDto
from passlib.context import CryptContext
from jose import jwt
import os
from datetime import datetime, timedelta
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

#all pathes starts with this prefix, and tag is to group it in swagger
router = APIRouter(prefix="/api/auth", tags=["auth"]) 

#object to work with passwords, bcrypt algorithm and auto updating of old hashes
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_token(user_id: str, email: str):
    expire = datetime.utcnow() + timedelta(minutes=int(os.getenv("JWT_EXPIRE_MINUTES", 120)))
    data = {"sub": user_id, "email": email, "exp": expire}
    return jwt.encode(data, os.getenv("JWT_SECRET"), algorithm=os.getenv("JWT_ALGORITHM"))

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security),db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        #take data from token
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=[os.getenv("JWT_ALGORITHM")])
        #take user Id
        user_id = payload.get("sub")
        #check for user in db
        user = db.query(ApplicationUser). filter(ApplicationUser.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

#the register endpoint
@router.post("/register")
def register(data: RegisterRequestDto, db: Session = Depends(get_db)):
    #does password mathc
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Password do not match")
    
    #is email already in use
    existing_user = db.query(ApplicationUser).filter(ApplicationUser.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")
        
    #hash password
    hashed = pwd_context.hash(data.password)

    #create user
    user = ApplicationUser(
        email=data.email,
        display_name=data.display_name,
        password_hash=hashed
    )

    #save to db
    db.add(user)
    db.commit()
    db.refresh(user)

    #response
    return UserResponseDto(
        id=user.id,
        email=user.email,
        display_name=user.display_name
    )

#the login endpoint
@router.post("/login")
def login(data: LoginRequestDto, db: Session = Depends(get_db)):
    #looking for user by email
    user = db.query(ApplicationUser).filter(ApplicationUser.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    #checking password
    if not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    #token
    token = create_token(user.id, user.email)

    #response
    return AuthResponse(
        token=token,
        user=UserResponseDto(
            id=user.id,
            email=user.email,
            display_name=user.display_name
        )
    )

#the me endpoint
@router.get("/me")
def me(current_user: ApplicationUser= Depends(get_current_user)):
    return UserResponseDto(
        id=current_user.id,
        email=current_user.email,
        display_name=current_user.display_name
    )