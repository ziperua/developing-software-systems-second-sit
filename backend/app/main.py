from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth

#creating tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Movie Watchlist API")

#connect routers
app.include_router(auth.router)

#Cors - allows front to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get("/")
def root():
    return{"message": "Movie Watchlist API"}