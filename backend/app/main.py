from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

#creating tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Movie Watchlist API")

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