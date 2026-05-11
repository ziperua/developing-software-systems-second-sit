# Movie Watchlist API

Backend for a movie watchlist app. Users can register, login, manage their own watchlist and add movies to a public community catalog.

Built with FastAPI (Python) and PostgreSQL.

## What it does

- Register and login with JWT authentication
- Each user has their own private watchlist
- Anyone can view the public community movie list
- Only logged in users can add community movies
- Only the person who added a community movie can edit or delete it

## How to run with Docker

You need Docker Desktop installed.

```bash
git clone https://github.com/ziperua/developing-software-systems-second-sit.git
cd developing-software-systems-second-sit

docker-compose up --build
```

API runs at: http://localhost:4058

Swagger docs: http://localhost:4058/docs

To stop:
```bash
docker-compose down
```

## How to run locally

You need Python 3.11 and PostgreSQL installed.

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the backend folder:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/moviewatchlist
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=120
```

Create the database:
```bash
python -c "import psycopg2; conn = psycopg2.connect('postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/postgres'); conn.autocommit = True; conn.cursor().execute('CREATE DATABASE moviewatchlist'); print('Done!')"
```

Start the server:
```bash
py -3.11 -m uvicorn app.main:app --reload --port 4058
```

## API endpoints

### Auth
- POST /api/auth/register - create account
- POST /api/auth/login - login and get token
- GET /api/auth/me - get current user (token required)

### Watchlist (private, token required)
- GET /api/watchlist - get my watchlist
- GET /api/watchlist/{id} - get one item
- POST /api/watchlist - add item
- PUT /api/watchlist/{id} - update item
- DELETE /api/watchlist/{id} - delete item

### Community movies
- GET /api/community-movies - list all (no token needed)
- GET /api/community-movies/{id} - get one (no token needed)
- POST /api/community-movies - add movie (token required)
- PUT /api/community-movies/{id} - update own movie (token required)
- DELETE /api/community-movies/{id} - delete own movie (token required)

## Tech used

- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT (python-jose)
- bcrypt (passlib)
- Pydantic
- Docker
