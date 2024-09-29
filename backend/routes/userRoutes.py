from fastapi import APIRouter, HTTPException
from typing import List
from models.userModel import UserCreate, User

userRouter = APIRouter()

# Dummy database
fake_users_db = [
    {"id": 1, "name": "John Doe", "email": "john@example.com"},
    {"id": 2, "name": "Jane Doe", "email": "jane@example.com"}
]

@userRouter.get("/users", response_model=List[User])
def get_users():
    """Fetch all users."""
    return fake_users_db

@userRouter.get("/users/{user_id}", response_model=User)
def get_user(user_id: int):
    """Fetch a single user by ID."""
    user = next((user for user in fake_users_db if user["id"] == user_id), None)
    if user:
        return user
    raise HTTPException(status_code=404, detail="User not found")

@userRouter.post("/users", response_model=User)
def create_user(user: UserCreate):
    """Create a new user."""
    new_user = {"id": len(fake_users_db) + 1, **user.dict()}
    fake_users_db.append(new_user)
    return new_user
