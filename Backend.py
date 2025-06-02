from typing import Optional, List
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
import os

from pydantic import BaseModel
from fastapi import (
    FastAPI, Depends, HTTPException, status, Request, Response
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlmodel import SQLModel, Field, create_engine, Session, select
from jose import jwt, JWTError
from passlib.context import CryptContext
import httpx

# ----- Auth config -----
SECRET_KEY = os.getenv("JWT_SECRET", "dev-secret-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def hash_pw(raw: str) -> str:
    return pwd_context.hash(raw)

def verify_pw(raw: str, hashed: str) -> bool:
    return pwd_context.verify(raw, hashed)

def create_token(data: dict, minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(minutes=minutes)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ----- Database config -----
sqlite_file_name = "jobs.db"
engine = create_engine(f"sqlite:///{sqlite_file_name}", echo=True)

def get_session():
    with Session(engine) as session:
        yield session

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Models -----
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    hashed_password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    about_me: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    profile_photo_url: Optional[str] = None
    resume: Optional[str] = None

class Employer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employer_name: str
    username: str
    hashed_password: str

class JobListing(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employer_id: int = Field(foreign_key="employer.id")
    title: str
    location: str
    type: str
    experience: str
    salary: str
    description: str

class Application(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    employer_id: int = Field(foreign_key="employer.id")
    job_listing_id: int = Field(foreign_key="joblisting.id")
    user_resume: str
    status: Optional[str] = Field(default="Submitted")

# Pydantic models for API
class Credentials(BaseModel):
    username: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None

class UpdateUser(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    about_me: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    profile_photo_url: Optional[str] = None

class SignupAttempt(BaseModel):
    username: str
    password: str
    role: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    employer_name: Optional[str] = None

# ----- Auth/user routes -----
@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(
    attempt: SignupAttempt,
    session: Session = Depends(get_session)
):
    existing_user = session.exec(select(User).where(User.username == attempt.username)).first()
    existing_employer = session.exec(select(Employer).where(Employer.username == attempt.username)).first()
    if existing_user or existing_employer:
        raise HTTPException(409, "Username already taken")
    
    if attempt.role == "user":
        user = User(
            username=attempt.username,
            hashed_password=hash_pw(attempt.password),
            first_name=attempt.first_name,
            last_name=attempt.last_name
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        token = create_token({"sub": attempt.username, "role": "user"})
        # Return the new user object as well!
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "role": "user",
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "about_me": user.about_me,
                "location": user.location,
                "linkedin_url": user.linkedin_url,
                "profile_photo_url": user.profile_photo_url,
            }
        }
    
    elif attempt.role == "employer":
        employer = Employer(
            username=attempt.username,
            hashed_password=hash_pw(attempt.password),
            employer_name=attempt.employer_name
        )
        session.add(employer)
        session.commit()
        session.refresh(employer)
        token = create_token({"sub": attempt.username, "role": "employer"})
        return {
            "access_token": token, 
            "token_type": "bearer",
            "employer": {
                "role": "employer",
                "id": employer.id,
                "employer_name": employer.employer_name,
                "username": employer.username
            }
        }
    
    else:
        raise HTTPException(400, "Invalid role")

@app.post("/login")
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.username == form.username)).first()
    if user and verify_pw(form.password, user.hashed_password):
        token = create_token({"sub": user.username, "role": "user"})

        return {
            "access_token": token,
            "user": {
                "role": "user",
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "username": user.username,
                "email": user.email,
                "about_me": user.about_me,
                "location": user.location,
                "linkedin_url": user.linkedin_url,
                "profile_photo_url": user.profile_photo_url,
            }
        }
    
    employer = session.exec(select(Employer).where(Employer.username == form.username)).first()
    if employer and verify_pw(form.password, employer.hashed_password):
        token = create_token({"sub": employer.username, "role": "employer"})

        return {
            "access_token": token,
            "user": {
                "role": "employer",
                "id": employer.id,
                "employer_name": employer.employer_name,
                "username": employer.username
            }
        }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/users", response_model=List[User])
def read_users(session: Session = Depends(get_session)):
    return session.exec(select(User)).all()

@app.get("/users/{user_id}", response_model=User)
def read_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user

@app.put("/users/{user_id}", response_model=User)
def update_user(
    user_id: int,
    user_data: UpdateUser,
    session: Session = Depends(get_session)
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    user_data_dict = user_data.dict(exclude_unset=True)
    for key, value in user_data_dict.items():
        setattr(user, key, value)
    session.commit()
    session.refresh(user)
    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    session.delete(user); session.commit()
    return {"ok": True}

def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
    except JWTError:
        raise HTTPException(401, "Invalid token")
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(401, "User not found")
    return user

# ----- Employers, Listings, Applications (no changes) -----
@app.post("/employers", response_model=Employer)
def create_employer(emp: Employer, session: Session = Depends(get_session)):
    session.add(emp); session.commit(); session.refresh(emp)
    return emp

@app.get("/employers", response_model=List[Employer])
def read_employers(session: Session = Depends(get_session)):
    return session.exec(select(Employer)).all()

@app.delete("/employers/{employer_id}")
def delete_employer(employer_id: int, session: Session = Depends(get_session)):
    emp = session.get(Employer, employer_id)
    if not emp:
        raise HTTPException(404, "Employer not found")
    session.delete(emp); session.commit()
    return {"ok": True}

@app.post("/listings", response_model=JobListing)
def create_listing(lst: JobListing, session: Session = Depends(get_session)):
    session.add(lst); session.commit(); session.refresh(lst)
    return lst

@app.get("/listings")
def read_listings(
    search: Optional[str] = None,
    session: Session = Depends(get_session),
):
    stmt = select(JobListing)
    if search:
        stmt = stmt.where(JobListing.title.ilike(f"%{search}%"))
    return {"listings": session.exec(stmt).all()}

@app.delete("/listings/{listing_id}")
def delete_listing(listing_id: int, session: Session = Depends(get_session)):
    lst = session.get(JobListing, listing_id)
    if not lst:
        raise HTTPException(404, "Listing not found")
    session.delete(lst); session.commit()
    return {"ok": True}

@app.post("/applications", response_model=Application)
def create_application(application: Application, session: Session = Depends(get_session)):
    session.add(application); session.commit(); session.refresh(application)
    return application

@app.get("/applications", response_model=List[Application])
def read_application(session: Session = Depends(get_session)):
    return session.exec(select(Application)).all()

@app.delete("/applications/{application_id}")
def delete_application(application_id: int, session: Session = Depends(get_session)):
    application = session.get(Application, application_id)
    if not application:
        raise HTTPException(404, "Application not found")
    session.delete(application); session.commit()
    return {"ok": True}

# ----- 3rd-party job APIs -----
REMOTIVE_PRIMARY  = "https://remotive.com/api/remote-jobs"
REMOTIVE_FALLBACK = "https://remotive.io/api/remote-jobs"

async def _query_remotive(params: dict):
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            r = await client.get(REMOTIVE_PRIMARY, params=params)
            r.raise_for_status()
        except httpx.HTTPStatusError:
            r = await client.get(REMOTIVE_FALLBACK, params=params)
            r.raise_for_status()
    return r.json().get("jobs", [])

@app.get("/remote")
async def remote_search(q: str, limit: int = 10):
    jobs = (await _query_remotive({"search": q, "limit": limit}))[:limit]
    return [
        {
            "id": idx,
            "title": j["title"],
            "company": j["company_name"],
            "location": j.get("candidate_required_location") or "Remote",
            "salary": j.get("salary"),
            "url": j["url"],
            "publication_date": j["publication_date"],
        }
        for idx, j in enumerate(jobs, start=1)
    ]

@app.get("/listings/{listing_id}/similar")
async def get_similar_jobs(
    listing_id: int,
    limit: int = 5,
    session: Session = Depends(get_session),
):
    listing = session.get(JobListing, listing_id)
    if not listing:
        raise HTTPException(404, "Listing not found")

    jobs = (await _query_remotive({"search": listing.title, "limit": limit}))[:limit]
    return {
        "local_listing": listing,
        "remote_matches": [
            {
                "title": j["title"],
                "company": j["company_name"],
                "url": j["url"],
                "publication_date": j["publication_date"],
                "salary": j.get("salary"),
            }
            for j in jobs
        ],
    }

# ----- Google OAuth (unchanged, stub) -----
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_REDIRECT_URI = "http://localhost:8000/google-callback"

@app.get("/google-login")
def google_login():
    url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        "&response_type=code&scope=openid%20email%20profile"
    )
    return RedirectResponse(url)

@app.get("/google-callback")
def google_callback(code: str):
    # still needa implement the google authentication
    return {"detail": "Google OAuth flow not implemented in this demo"}

@app.get("/debug/usernames")
def get_usernames(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    employers = session.exec(select(Employer)).all()
    return {
        "usernames": [u.username for u in users + employers]
    }
