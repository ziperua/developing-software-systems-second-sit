# Development Log

**Student**: Denis Denysenko
**Project**: Movie Watchlist API

---

## How the app works

The app has two main parts - a private watchlist and a public community movie catalog.

When a user registers, their password gets hashed with bcrypt before saving to the database. Plain text passwords are never stored. When they log in, the server checks the hash and if it matches, creates a JWT token. This token gets sent with every request that needs authentication, so the server knows who is making the request.

The watchlist is private - each item is linked to a user with a foreign key, and the server checks ownership before allowing any changes. If you try to edit someone else's item, you get a 403 error.

Community movies work differently - anyone can read them without logging in, but only authenticated users can add new ones. When adding a movie, the server automatically saves the creator's ID and display name in the record. This way when listing movies you don't need to do extra database queries to find the author's name.

Pydantic handles all the validation automatically. If a required field is missing or a value is out of range, FastAPI returns a 422 error with a readable message explaining what went wrong.

---

## What I built step by step

**Step 1 - Setup**  
Created the project structure and installed packages. Had to use Python 3.11 because 3.14 was too new and some packages didn't support it yet.

**Step 2 - Database models**  
Created three models: ApplicationUser, WatchlistItem, CommunityMovie. Used UUID strings as primary keys so they are harder to guess than sequential integers.

**Step 3 - Schemas**  
Created Pydantic schemas for all inputs and outputs. The response schemas don't include password_hash so it never gets sent to the client by accident.

**Step 4 - Auth endpoints**  
Register, login, and /me. Had a problem with bcrypt version incompatibility - fixed by pinning bcrypt==4.0.1 in requirements.

**Step 5 - Watchlist CRUD**  
All five endpoints with ownership checks. Returns 403 if you try to access someone else's item.

**Step 6 - Community movies**  
GET endpoints work without a token. POST/PUT/DELETE require a token. PUT and DELETE also check that you are the creator.

**Step 7 - Validation**  
Added Field() validators to all schemas - string lengths, rating range 1-10, release year 1888 to current+2, Literal for status values.

**Step 8 - Docker**  
Created Dockerfile and docker-compose.yml with PostgreSQL and a healthcheck so the API waits for the database before starting.

---

## Problems I ran into

**bcrypt version conflict**  
passlib was not working with the latest bcrypt. Fixed by adding bcrypt==4.0.1 to requirements.txt.

**Docker database connection**  
The app was trying to connect to 127.0.0.1 inside the container instead of the db service. The problem was load_dotenv(override=True) was overwriting Docker environment variables with the local .env values. Removed override=True and Docker env vars work correctly now.

**Local PostgreSQL blocking Docker**  
Had PostgreSQL already installed on Windows which was using port 5432. Had to figure out the local password and use it in .env for local development.

**Python version**  
Python 3.14 was installed but psycopg2 and pydantic-core couldn't build for it. Installed Python 3.11 separately and used py -3.11 to run the project.
